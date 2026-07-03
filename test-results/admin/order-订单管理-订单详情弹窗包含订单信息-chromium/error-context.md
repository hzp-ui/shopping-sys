# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: order.spec.js >> 订单管理 >> 订单详情弹窗包含订单信息
- Location: tests\admin\order.spec.js:77:3

# Error details

```
Test timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - complementary [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]: 云亩商城管理系统
      - menu [ref=e7]:
        - menuitem "dashboard 控制台" [ref=e8] [cursor=pointer]:
          - img "dashboard" [ref=e9]:
            - img [ref=e10]
          - generic [ref=e12]: 控制台
        - menuitem "shopping 商品管理" [ref=e13] [cursor=pointer]:
          - img "shopping" [ref=e14]:
            - img [ref=e15]
          - generic [ref=e17]: 商品管理
        - menuitem "unordered-list 订单管理" [ref=e18] [cursor=pointer]:
          - img "unordered-list" [ref=e19]:
            - img [ref=e20]
          - generic [ref=e22]: 订单管理
        - menuitem "user 用户管理" [ref=e23] [cursor=pointer]:
          - img "user" [ref=e24]:
            - img [ref=e25]
          - generic [ref=e27]: 用户管理
  - generic [ref=e28]:
    - banner [ref=e29]:
      - img "menu-fold" [ref=e30] [cursor=pointer]:
        - img [ref=e31]
      - generic [ref=e33] [cursor=pointer]:
        - img "user" [ref=e36]:
          - img [ref=e37]
        - generic [ref=e39]: 管理员
    - main [ref=e40]
```