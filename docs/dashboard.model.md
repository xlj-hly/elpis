```javascript
{
    mode: 'dashboard', // 模板类型, 不同模板类型对应不一样的模板数据结构
    name: '', // 名称
    desc: '', // 描述
    icon: '', // 图标
    homePage: '', // 首页路径
    // 头部菜单
    menu: [{
        key: '', // 菜单唯一标识
        name: '', // 菜单名称
        menuType: '', // 枚举, group | module

        // 当 menuType == group 时, 可填
        subMenu: [{
            // 可递归 menuItem
        }, ...],

        // 当 menuType == module 时, 可填
        moduleType: '', // 枚举, sider | iframe | custom | schema

        // 当 moduleType == sider 时
        siderConfig: {
            menu: [{
                // 可递归 menuItem(除 moduleType === sider)
            }, ...]
        },

        // 当 moduleType == iframe 时
        iframeConfig: {
            path: '', // iframe 路径
        },

        // 当 moduleType == custom 时
        customConfig: {
            path: '', // 自定义路由路径
        },

        // 当 moduleType == schema 时
        schemaConfig: {
            api: '', // 数据源 API (RESTful API)
            schema: {
                type: 'object',
                properties: {
                    key: {
                        ...schema, // 标准 schema
                        type: '', // 字段类型
                        label: '', // 字段的中文名
                    },
                    ...
                },
            },
            tableConfig: {}, // table 配置
            searchConfig: {}, // search-bar 配置
            components: {}, // 模块组件
        },
    }, ...]
}
```
