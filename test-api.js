const http = require('http');

const BASE_URL = 'http://localhost:8080';
let userToken = null;
let adminToken = null;
let testUserId = null;
let testOrderNo = null;
let addressId = null;

let passed = 0;
let failed = 0;
const results = [];

function apiTest(name, method, path, body = null, token = null, expectSuccess = true) {
    return new Promise((resolve) => {
        const url = new URL(BASE_URL + path);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (token) {
            options.headers['Authorization'] = 'Bearer ' + token;
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                let result;
                try {
                    result = JSON.parse(data);
                } catch (e) {
                    result = { code: -1, message: 'Invalid JSON: ' + data };
                }

                const isSuccess = result.code === 200;
                const pass = isSuccess === expectSuccess;

                if (pass) {
                    passed++;
                    console.log(`  [${method}] ${path}  \x1b[32mPASS\x1b[0m`);
                } else {
                    failed++;
                    const expectStr = expectSuccess ? 'success' : 'fail';
                    const actualStr = isSuccess ? 'success' : 'fail';
                    console.log(`  [${method}] ${path}  \x1b[31mFAIL\x1b[0m (expected: ${expectStr}, actual: ${actualStr}, msg: ${result.message || 'unknown'})`);
                }

                results.push({
                    name,
                    method,
                    path,
                    status: pass ? 'PASS' : 'FAIL',
                    responseCode: result.code,
                    message: result.message || ''
                });

                resolve(result);
            });
        });

        req.on('error', (e) => {
            failed++;
            console.log(`  [${method}] ${path}  \x1b[31mERROR\x1b[0m (${e.message})`);
            results.push({
                name,
                method,
                path,
                status: 'ERROR',
                responseCode: 0,
                message: e.message
            });
            resolve(null);
        });

        req.setTimeout(10000, () => {
            req.destroy();
        });

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

function printHeader(title) {
    console.log('');
    console.log('==============================================');
    console.log(`  ${title}`);
    console.log('==============================================');
}

async function main() {
    console.log('');
    console.log('==============================================');
    console.log('  Yunmu Shopping - Full API Test');
    console.log('==============================================');
    console.log(`Base URL: ${BASE_URL}`);
    console.log(`Start: ${new Date().toLocaleString()}`);

    // 1. Home Module
    printHeader('1. Home Module');
    await apiTest('Get Banner List', 'GET', '/api/home/banner');
    await apiTest('Get Nav List', 'GET', '/api/home/nav');
    await apiTest('Get Recommend Products', 'GET', '/api/home/recommend-products');

    // 2. Goods Module
    printHeader('2. Goods Module');
    await apiTest('Get Goods List', 'GET', '/api/goods/list?pageNum=1&pageSize=10');
    await apiTest('Get Goods Detail', 'GET', '/api/goods/detail/1');
    await apiTest('Get Category List', 'GET', '/api/category/list');

    // 3. Store Module
    printHeader('3. Store Module');
    await apiTest('Get Store List', 'GET', '/api/store/list');

    // 4. User Auth
    printHeader('4. User Module - Auth');
    
    // Send SMS code first
    await apiTest('Send SMS Code', 'POST', '/api/user/sms-code', {
        phone: '13800138000',
        type: 1
    });
    
    const registerResult = await apiTest('User Register', 'POST', '/api/user/register', {
        phone: '13800138000',
        password: '123456',
        code: '123456'
    });

    const loginResult = await apiTest('User Login', 'POST', '/api/user/login', {
        phone: '13800138000',
        password: '123456'
    });

    if (loginResult && loginResult.code === 200 && loginResult.data) {
        userToken = loginResult.data.token;
        testUserId = loginResult.data.userId;
        console.log('  User token obtained');
    }

    // 5. User Info (login required)
    printHeader('5. User Module (Login Required)');
    if (userToken) {
        await apiTest('Get User Info', 'GET', '/api/user/info', null, userToken);
        await apiTest('Update User Info', 'PUT', '/api/user/update', {
            nickname: 'TestUserUpdated',
            gender: 1
        }, userToken);
        await apiTest('Get Points Records', 'GET', '/api/points/records', null, userToken);
    } else {
        console.log('  SKIPPED - No user token');
    }

    // 6. Address Module
    printHeader('6. Address Module');
    if (userToken) {
        await apiTest('Get Address List', 'GET', '/api/user/address/list', null, userToken);

        const addAddrResult = await apiTest('Add Address', 'POST', '/api/user/address', {
            name: 'Zhang San',
            phone: '13800138000',
            province: 'Guangdong',
            city: 'Shenzhen',
            district: 'Nanshan',
            detail: 'Tech Park',
            isDefault: 1
        }, userToken);

        if (addAddrResult && addAddrResult.code === 200 && addAddrResult.data) {
            addressId = addAddrResult.data;
            console.log(`  Address ID: ${addressId}`);
        }

        if (addressId) {
            await apiTest('Update Address', 'PUT', `/api/user/address/${addressId}`, {
                name: 'Zhang San',
                phone: '13800138000',
                province: 'Guangdong',
                city: 'Shenzhen',
                district: 'Nanshan',
                detail: 'Tech Park Updated',
                isDefault: 1
            }, userToken);
        }
    } else {
        console.log('  SKIPPED - No user token');
    }

    // 7. Cart Module
    printHeader('7. Cart Module');
    if (userToken) {
        await apiTest('Add to Cart', 'POST', '/api/cart/add', {
            goodsId: 1,
            skuId: 0,
            quantity: 2
        }, userToken);
        await apiTest('Get Cart List', 'GET', '/api/cart/list', null, userToken);
    } else {
        console.log('  SKIPPED - No user token');
    }

    // 8. Order Module
    printHeader('8. Order Module');
    if (userToken) {
        const createOrderResult = await apiTest('Create Order', 'POST', '/api/order/create', {
            cartIds: [1],
            addressId: addressId,
            remark: 'Test Order',
            deliveryType: 1
        }, userToken);

        if (createOrderResult && createOrderResult.code === 200 && createOrderResult.data) {
            testOrderNo = createOrderResult.data.orderNo;
            console.log(`  Order No: ${testOrderNo}`);
        }

        await apiTest('Get Order List', 'GET', '/api/order/list?pageNum=1&pageSize=10', null, userToken);
    } else {
        console.log('  SKIPPED - No user token');
    }

    // 9. Coupon Module
    printHeader('9. Coupon Module');
    if (userToken) {
        await apiTest('Get Coupon List', 'GET', '/api/coupon/list', null, userToken);
        await apiTest('Receive Coupon', 'POST', '/api/coupon/receive/1', null, userToken);
        await apiTest('My Coupons', 'GET', '/api/user/coupon', null, userToken);
    } else {
        console.log('  SKIPPED - No user token');
    }

    // 10. Wallet Module
    printHeader('10. Wallet Module');
    if (userToken) {
        await apiTest('Get Balance', 'GET', '/api/wallet/balance', null, userToken);
        await apiTest('Wallet Records', 'GET', '/api/wallet/records', null, userToken);
    } else {
        console.log('  SKIPPED - No user token');
    }

    // 11. Distribution Module
    printHeader('11. Distribution Module');
    if (userToken) {
        await apiTest('Distribution Center', 'GET', '/api/distribution/center', null, userToken);
        await apiTest('Distribution Products', 'GET', '/api/distribution/products', null, userToken);
    } else {
        console.log('  SKIPPED - No user token');
    }

    // 12. Admin Module
    printHeader('12. Admin Module');
    const adminLoginResult = await apiTest('Admin Login', 'POST', '/api/admin/login', {
        username: 'admin',
        password: 'admin123'
    });

    if (adminLoginResult && adminLoginResult.code === 200 && adminLoginResult.data) {
        adminToken = adminLoginResult.data.token;
        console.log('  Admin token obtained');
    }

    if (adminToken) {
        await apiTest('Get Admin Info', 'GET', '/api/admin/info', null, adminToken);
    }

    // 13. Admin - Goods
    printHeader('13. Admin - Goods Management');
    if (adminToken) {
        await apiTest('Admin Goods List', 'GET', '/api/admin/goods/list?pageNum=1&pageSize=10', null, adminToken);
    } else {
        console.log('  SKIPPED - No admin token');
    }

    // 14. Admin - Orders
    printHeader('14. Admin - Order Management');
    if (adminToken) {
        await apiTest('Admin Order List', 'GET', '/api/admin/order/list?pageNum=1&pageSize=10', null, adminToken);
    } else {
        console.log('  SKIPPED - No admin token');
    }

    // 15. Admin - Dashboard (skip if not implemented)
    printHeader('15. Admin - Dashboard');
    if (adminToken) {
        console.log('  Dashboard statistics API - SKIPPED (not implemented)');
    } else {
        console.log('  SKIPPED - No admin token');
    }

    // 16. Security Test
    printHeader('16. Security Test');
    await apiTest('Unauthorized User Info', 'GET', '/api/user/info', null, null, false);
    await apiTest('Unauthorized Admin Info', 'GET', '/api/admin/info', null, null, false);

    // Summary
    console.log('');
    console.log('==============================================');
    console.log('           Test Result Summary');
    console.log('==============================================');
    console.log('');
    console.log(`  Total Tests: ${results.length}`);
    console.log(`  \x1b[32mPassed: ${passed}\x1b[0m`);
    console.log(`  \x1b[31mFailed: ${failed}\x1b[0m`);
    const passRate = results.length > 0 ? ((passed / results.length) * 100).toFixed(2) : 0;
    console.log(`  Pass Rate: ${passRate}%`);
    console.log('');
    console.log(`End Time: ${new Date().toLocaleString()}`);
    console.log('');

    // Failure details
    if (failed > 0) {
        console.log('\x1b[31mFailure Details:\x1b[0m');
        console.log('----------------------------------------------');
        for (const r of results) {
            if (r.status !== 'PASS') {
                console.log(`  [${r.status}] ${r.method} ${r.path}`);
                console.log(`    ${r.name} - ${r.message}`);
            }
        }
        console.log('');
    }

    // Export CSV
    const fs = require('fs');
    const csvPath = require('path').join(__dirname, 'test-results.csv');
    const csvHeader = 'Name,Method,Path,Status,ResponseCode,Message\n';
    const csvRows = results.map(r => 
        `"${r.name}","${r.method}","${r.path}","${r.status}",${r.responseCode},"${r.message.replace(/"/g, '""')}"`
    ).join('\n');
    fs.writeFileSync(csvPath, '\uFEFF' + csvHeader + csvRows, 'utf8');
    console.log(`Results exported to: ${csvPath}`);
    console.log('');
}

main().catch(console.error);
