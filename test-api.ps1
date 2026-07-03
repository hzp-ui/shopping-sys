# =============================================
# Yunmu Shopping API Test Script
# Compatible with PowerShell 5
# =============================================

$BaseUrl = "http://localhost:8080"
$TestResults = New-Object System.Collections.ArrayList
$PassedCount = 0
$FailedCount = 0
$UserToken = $null
$AdminToken = $null
$TestUserId = $null
$TestOrderNo = $null

function Write-TestHeader {
    param([string]$Title)
    Write-Host ""
    Write-Host "==============================================" -ForegroundColor Cyan
    Write-Host "  $Title" -ForegroundColor Cyan
    Write-Host "==============================================" -ForegroundColor Cyan
}

function Invoke-ApiTest {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Path,
        [hashtable]$Body = $null,
        [string]$Token = $null,
        [bool]$ExpectSuccess = $true
    )

    $url = $BaseUrl + $Path
    $headers = @{
        "Content-Type" = "application/json"
    }

    if ($Token) {
        $headers["Authorization"] = "Bearer $Token"
    }

    Write-Host "  [$Method] $Path  " -NoNewline

    try {
        $bodyJson = $null
        if ($Body) {
            $bodyJson = $Body | ConvertTo-Json -Depth 10
        }

        $response = Invoke-WebRequest -Uri $url -Method $Method -Headers $headers -Body $bodyJson -UseBasicParsing -TimeoutSec 10
        $content = $response.Content | ConvertFrom-Json

        $isSuccess = ($content.code -eq 200)
        $expectStr = if ($ExpectSuccess) { "success" } else { "fail" }
        $actualStr = if ($isSuccess) { "success" } else { "fail" }

        if ($isSuccess -eq $ExpectSuccess) {
            Write-Host "PASS" -ForegroundColor Green
            $script:PassedCount++
            $result = @{
                Name = $Name
                Method = $Method
                Path = $Path
                Status = "PASS"
                ResponseCode = $content.code
                Message = $content.message
            }
        } else {
            Write-Host "FAIL (expected: $expectStr, actual: $actualStr, msg: $($content.message))" -ForegroundColor Red
            $script:FailedCount++
            $result = @{
                Name = $Name
                Method = $Method
                Path = $Path
                Status = "FAIL"
                ResponseCode = $content.code
                Message = $content.message
            }
        }

        [void]$script:TestResults.Add($result)
        return $content
    }
    catch {
        $errorMsg = $_.Exception.Message
        Write-Host "ERROR ($errorMsg)" -ForegroundColor Red
        $script:FailedCount++
        $result = @{
            Name = $Name
            Method = $Method
            Path = $Path
            Status = "ERROR"
            ResponseCode = 0
            Message = $errorMsg
        }
        [void]$script:TestResults.Add($result)
        return $null
    }
}

# =============================================
# Test Start
# =============================================
Write-Host ""
Write-Host "==============================================" -ForegroundColor Magenta
Write-Host "  Yunmu Shopping - Full API Test" -ForegroundColor Magenta
Write-Host "==============================================" -ForegroundColor Magenta
Write-Host "Base URL: $BaseUrl"
Write-Host "Start: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

# =============================================
# 1. Home Module
# =============================================
Write-TestHeader "1. Home Module"

Invoke-ApiTest -Name "Get Banner List" -Method "GET" -Path "/api/home/banner"
Invoke-ApiTest -Name "Get Nav List" -Method "GET" -Path "/api/home/nav"
Invoke-ApiTest -Name "Get Recommend Products" -Method "GET" -Path "/api/home/recommend-products"

# =============================================
# 2. Goods Module
# =============================================
Write-TestHeader "2. Goods Module"

Invoke-ApiTest -Name "Get Goods List" -Method "GET" -Path "/api/goods/list?pageNum=1&pageSize=10"
Invoke-ApiTest -Name "Get Goods Detail" -Method "GET" -Path "/api/goods/detail/1"
Invoke-ApiTest -Name "Get Category List" -Method "GET" -Path "/api/category/list"

# =============================================
# 3. Store Module
# =============================================
Write-TestHeader "3. Store Module"

Invoke-ApiTest -Name "Get Store List" -Method "GET" -Path "/api/store/list"

# =============================================
# 4. User - Register & Login
# =============================================
Write-TestHeader "4. User Module - Auth"

$registerResult = Invoke-ApiTest -Name "User Register" -Method "POST" -Path "/api/user/register" -Body @{
    phone = "13800138000"
    password = "123456"
    nickname = "TestUser"
}

$loginResult = Invoke-ApiTest -Name "User Login" -Method "POST" -Path "/api/user/login" -Body @{
    phone = "13800138000"
    password = "123456"
}

if ($loginResult -and $loginResult.code -eq 200 -and $loginResult.data) {
    if ($loginResult.data.token) {
        $UserToken = $loginResult.data.token
    }
    if ($loginResult.data.userId) {
        $TestUserId = $loginResult.data.userId
    }
    Write-Host "  User token obtained" -ForegroundColor Green
}

# =============================================
# 5. User - Info (requires login)
# =============================================
Write-TestHeader "5. User Module (Login Required)"

if ($UserToken) {
    Invoke-ApiTest -Name "Get User Info" -Method "GET" -Path "/api/user/info" -Token $UserToken
    Invoke-ApiTest -Name "Update User Info" -Method "PUT" -Path "/api/user/update" -Token $UserToken -Body @{
        nickname = "TestUserUpdated"
        gender = 1
    }
    Invoke-ApiTest -Name "Get Points Records" -Method "GET" -Path "/api/points/records" -Token $UserToken
} else {
    Write-Host "  SKIPPED - No user token" -ForegroundColor Yellow
}

# =============================================
# 6. Address Module
# =============================================
Write-TestHeader "6. Address Module"

$AddressId = $null
if ($UserToken) {
    Invoke-ApiTest -Name "Get Address List" -Method "GET" -Path "/api/user/address/list" -Token $UserToken

    $addAddrResult = Invoke-ApiTest -Name "Add Address" -Method "POST" -Path "/api/user/address" -Token $UserToken -Body @{
        name = "Zhang San"
        phone = "13800138000"
        province = "Guangdong"
        city = "Shenzhen"
        district = "Nanshan"
        detail = "Tech Park"
        isDefault = 1
    }

    if ($addAddrResult -and $addAddrResult.code -eq 200 -and $addAddrResult.data) {
        $AddressId = $addAddrResult.data
        Write-Host "  Address ID: $AddressId" -ForegroundColor Green
    }

    if ($AddressId) {
        Invoke-ApiTest -Name "Update Address" -Method "PUT" -Path "/api/user/address/$AddressId" -Token $UserToken -Body @{
            name = "Zhang San"
            phone = "13800138000"
            province = "Guangdong"
            city = "Shenzhen"
            district = "Nanshan"
            detail = "Tech Park Updated"
            isDefault = 1
        }
    }
} else {
    Write-Host "  SKIPPED - No user token" -ForegroundColor Yellow
}

# =============================================
# 7. Cart Module
# =============================================
Write-TestHeader "7. Cart Module"

if ($UserToken) {
    Invoke-ApiTest -Name "Add to Cart" -Method "POST" -Path "/api/cart/add" -Token $UserToken -Body @{
        goodsId = 1
        skuId = 0
        quantity = 2
    }
    Invoke-ApiTest -Name "Get Cart List" -Method "GET" -Path "/api/cart/list" -Token $UserToken
} else {
    Write-Host "  SKIPPED - No user token" -ForegroundColor Yellow
}

# =============================================
# 8. Order Module
# =============================================
Write-TestHeader "8. Order Module"

if ($UserToken) {
    $createOrderResult = Invoke-ApiTest -Name "Create Order" -Method "POST" -Path "/api/order/create" -Token $UserToken -Body @{
        cartIds = @(1)
        addressId = $AddressId
        remark = "Test Order"
        deliveryType = 1
    }

    if ($createOrderResult -and $createOrderResult.code -eq 200 -and $createOrderResult.data) {
        if ($createOrderResult.data.orderNo) {
            $TestOrderNo = $createOrderResult.data.orderNo
            Write-Host "  Order No: $TestOrderNo" -ForegroundColor Green
        }
    }

    Invoke-ApiTest -Name "Get Order List" -Method "GET" -Path "/api/order/list?pageNum=1&pageSize=10" -Token $UserToken
} else {
    Write-Host "  SKIPPED - No user token" -ForegroundColor Yellow
}

# =============================================
# 9. Coupon Module
# =============================================
Write-TestHeader "9. Coupon Module"

if ($UserToken) {
    Invoke-ApiTest -Name "Get Coupon List" -Method "GET" -Path "/api/coupon/list" -Token $UserToken
    Invoke-ApiTest -Name "Receive Coupon" -Method "POST" -Path "/api/coupon/receive/1" -Token $UserToken
    Invoke-ApiTest -Name "My Coupons" -Method "GET" -Path "/api/user/coupon" -Token $UserToken
} else {
    Write-Host "  SKIPPED - No user token" -ForegroundColor Yellow
}

# =============================================
# 10. Wallet Module
# =============================================
Write-TestHeader "10. Wallet Module"

if ($UserToken) {
    Invoke-ApiTest -Name "Get Balance" -Method "GET" -Path "/api/wallet/balance" -Token $UserToken
    Invoke-ApiTest -Name "Wallet Records" -Method "GET" -Path "/api/wallet/records" -Token $UserToken
} else {
    Write-Host "  SKIPPED - No user token" -ForegroundColor Yellow
}

# =============================================
# 11. Distribution Module
# =============================================
Write-TestHeader "11. Distribution Module"

if ($UserToken) {
    Invoke-ApiTest -Name "Distribution Center" -Method "GET" -Path "/api/distribution/center" -Token $UserToken
    Invoke-ApiTest -Name "Distribution Products" -Method "GET" -Path "/api/distribution/products" -Token $UserToken
} else {
    Write-Host "  SKIPPED - No user token" -ForegroundColor Yellow
}

# =============================================
# 12. Admin Module
# =============================================
Write-TestHeader "12. Admin Module"

$adminLoginResult = Invoke-ApiTest -Name "Admin Login" -Method "POST" -Path "/api/admin/login" -Body @{
    username = "admin"
    password = "admin123"
}

if ($adminLoginResult -and $adminLoginResult.code -eq 200 -and $adminLoginResult.data) {
    if ($adminLoginResult.data.token) {
        $AdminToken = $adminLoginResult.data.token
        Write-Host "  Admin token obtained" -ForegroundColor Green
    }
}

if ($AdminToken) {
    Invoke-ApiTest -Name "Get Admin Info" -Method "GET" -Path "/api/admin/info" -Token $AdminToken
}

# =============================================
# 13. Admin - Goods Management
# =============================================
Write-TestHeader "13. Admin - Goods Management"

if ($AdminToken) {
    Invoke-ApiTest -Name "Admin Goods List" -Method "GET" -Path "/api/admin/goods/list?pageNum=1&pageSize=10" -Token $AdminToken
} else {
    Write-Host "  SKIPPED - No admin token" -ForegroundColor Yellow
}

# =============================================
# 14. Admin - Order Management
# =============================================
Write-TestHeader "14. Admin - Order Management"

if ($AdminToken) {
    Invoke-ApiTest -Name "Admin Order List" -Method "GET" -Path "/api/admin/order/list?pageNum=1&pageSize=10" -Token $AdminToken
} else {
    Write-Host "  SKIPPED - No admin token" -ForegroundColor Yellow
}

# =============================================
# 15. Admin - Dashboard
# =============================================
Write-TestHeader "15. Admin - Dashboard"

if ($AdminToken) {
    Invoke-ApiTest -Name "Get Statistics" -Method "GET" -Path "/api/admin/dashboard/statistics" -Token $AdminToken
} else {
    Write-Host "  SKIPPED - No admin token" -ForegroundColor Yellow
}

# =============================================
# 16. Security Test
# =============================================
Write-TestHeader "16. Security Test"

Invoke-ApiTest -Name "Unauthorized User Info" -Method "GET" -Path "/api/user/info" -ExpectSuccess $false
Invoke-ApiTest -Name "Unauthorized Admin" -Method "GET" -Path "/api/admin/dashboard/statistics" -ExpectSuccess $false

# =============================================
# Test Summary
# =============================================
Write-Host ""
Write-Host "==============================================" -ForegroundColor Magenta
Write-Host "           Test Result Summary" -ForegroundColor Magenta
Write-Host "==============================================" -ForegroundColor Magenta
Write-Host ""
Write-Host "  Total Tests: $($TestResults.Count)" -ForegroundColor White
Write-Host "  Passed: $PassedCount" -ForegroundColor Green
Write-Host "  Failed: $FailedCount" -ForegroundColor $(if ($FailedCount -eq 0) { "Green" } else { "Red" })

$passRate = 0
if ($TestResults.Count -gt 0) {
    $passRate = [math]::Round($PassedCount / $TestResults.Count * 100, 2)
}
Write-Host "  Pass Rate: $passRate%" -ForegroundColor Cyan
Write-Host ""
Write-Host "End Time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host ""

# Failure details
if ($FailedCount -gt 0) {
    Write-Host "Failure Details:" -ForegroundColor Red
    Write-Host "----------------------------------------------" -ForegroundColor Red
    foreach ($result in $TestResults) {
        if ($result.Status -ne "PASS") {
            Write-Host "  [$($result.Status)] $($result.Method) $($result.Path)" -ForegroundColor Red
            Write-Host "    $($result.Name) - $($result.Message)" -ForegroundColor DarkRed
        }
    }
    Write-Host ""
}

# Export CSV
$csvPath = Join-Path $PSScriptRoot "test-results.csv"
$TestResults | ForEach-Object { New-Object PSObject -Property $_ } | Export-Csv -Path $csvPath -NoTypeInformation -Encoding UTF8
Write-Host "Results exported to: $csvPath" -ForegroundColor Cyan
Write-Host ""
