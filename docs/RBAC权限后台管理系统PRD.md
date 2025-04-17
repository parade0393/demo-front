# RBAC权限后台管理系统产品需求文档

## 1. 文档概述

### 1.1 目的

本文档旨在详细描述基于RBAC（基于角色的访问控制）的后台管理系统的功能需求、接口规范和技术实现方案，为开发团队提供明确的开发指导。

### 1.2 适用范围

本文档适用于开发团队、测试团队、产品经理以及相关项目干系人。

### 1.3 系统概述

本系统是一个基于RBAC权限模型的后台管理系统，提供用户认证、用户管理、部门管理、角色管理、权限管理、菜单路由管理、字典管理、文件上传管理以及操作日志等功能，旨在为企业提供一个安全、高效、可扩展的后台管理平台。

## 2. 技术架构

### 2.1 技术选型

| 类别     | 技术选择             | 说明                                  |
| -------- | -------------------- | ------------------------------------- |
| 开发语言 | Java 17+             | 长期支持版本，提供现代Java特性        |
| 构建工具 | Maven                | 主流依赖管理和项目构建工具            |
| 主框架   | Spring Boot 3.x      | 简化配置的企业级应用框架              |
| ORM框架  | MyBatis-Plus         | 简化单表操作，搭配 XML 可处理复杂 SQL |
| 数据库   | MySQL                | 关系型数据库                          |
| 安全框架 | Spring Security      | 全面的认证和授权框架                  |
| JWT认证  | jjwt                 | JWT令牌生成和验证库                   |
| 权限缓存 | Redis                | 高性能的缓存方案                      |
| 日志框架 | SLF4J + Logback      | 灵活的日志管理                        |
| API文档  | SpringDoc(OpenAPI 3) | RESTful API文档自动生成               |
| 单元测试 | JUnit 5 + Mockito    | 测试框架和模拟框架                    |
| 代码简化 | Lombok               | 减少样板代码的工具库                  |
| 数据校验 | Hibernate Validator  | 基于注解的数据验证框架                |
| 限流工具 | Guava RateLimiter    | 接口限流实现                          |
| 数据加密 | AES/RSA              | 敏感数据加密                          |

### 2.2 系统架构图

```
+------------------+     +------------------+     +------------------+
|--|--|--|--|--|
| 前端应用 |  | 网关/负载均衡 |  | 认证授权服务 |
| (Vue/React) | <---> | (Nginx/Gateway) | <---> | (Spring Security) |
|--|--|--|--|--|
+------------------+     +------------------+     +--------+--------+
                                                          |
                                                          v
+------------------+     +------------------+     +------------------+
|--|--|--|--|--|
| 业务服务层 | <---> | 数据访问层 | <---> | 数据库 |
| (Spring Boot) |  | (MyBatis-Plus) |  | (MySQL) |
|--|--|--|--|--|
+------------------+     +------------------+     +------------------+
        |                                                 |
        v                                                 v
+------------------+                             +------------------+
|--|--|--|
| 缓存服务 |  | 文件存储服务 |
| (Redis) |  | (本地/云存储) |
|--|--|--|
+------------------+                             +------------------+
```

## 3. 功能需求

### 3.1 用户认证模块

#### 3.1.1 登录功能

- **功能描述**：用户通过用户名和密码进行系统登录
- **接口定义**：
  - 请求方式：POST
  - 接口路径：/api/login
  - 请求参数：
    ```json
    {
      "username": "string", // 用户名
      "password": "string", // 密码
      "captcha": "string", // 验证码
      "captchaId": "string" // 验证码ID
    }
    ```
  - 响应结果：
    ```json
    {
      "code": 200,
      "message": "success",
      "data": {
        "token": "string" // JWT令牌
      }
    }
    ```

#### 3.1.2 验证码生成

- **功能描述**：生成图形验证码，用于登录验证
- **接口定义**：
  - 请求方式：GET
  - 接口路径：/api/captcha
  - 请求参数：无
  - 响应结果：
    ```json
    {
      "code": 200,
      "message": "success",
      "data": {
        "captchaId": "string", // 验证码ID
        "captchaImage": "string" // Base64编码的验证码图片
      }
    }
    ```

#### 3.1.3 退出登录

- **功能描述**：用户退出系统，清除登录状态
- **接口定义**：
  - 请求方式：POST
  - 接口路径：/api/logout
  - 请求参数：无
  - 响应结果：
    ```json
    {
      "code": 200,
      "message": "success",
      "data": true
    }
    ```

#### 3.1.4 获取用户信息

- **功能描述**：获取当前登录用户的基本信息和权限信息
- **接口定义**：
  - 请求方式：GET
  - 接口路径：/api/user/info
  - 请求参数：无
  - 响应结果：
    ```json
    {
      "code": 200,
      "message": "success",
      "data": {
        "id": 1,
        "username": "admin",
        "nickname": "管理员",
        "email": "admin@example.com",
        "phone": "13800138000",
        "status": 1,
        "roleIds": [1, 2],
        "deptIds": [1, 2],
        "primaryDeptId": 1,
        "createTime": "2023-01-01 00:00:00"
      }
    }
    ```

### 3.2 用户管理模块

#### 3.2.1 用户列表

- **功能描述**：分页查询用户列表，支持条件筛选
- **接口定义**：
  - 请求方式：GET
  - 接口路径：/api/system/users
  - 请求参数：
    ```
    page: 页码
    pageSize: 每页条数
    username: 用户名（可选）
    status: 状态（可选）
    deptId: 部门ID（可选）
    ```
  - 响应结果：
    ```json
    {
      "code": 200,
      "message": "success",
      "data": {
        "list": [
          {
            "id": 1,
            "username": "admin",
            "nickname": "管理员",
            "email": "admin@example.com",
            "phone": "13800138000",
            "status": 1,
            "roles": [
              {
                "id": 1,
                "name": "超级管理员"
              },
              {
                "id": 2,
                "name": "部门经理"
              }
            ],
            "departments": [
              {
                "id": 1,
                "name": "总公司",
                "isPrimary": true
              },
              {
                "id": 2,
                "name": "研发部",
                "isPrimary": false
              }
            ],
            "createTime": "2023-01-01 00:00:00"
          }
        ],
        "total": 100,
        "page": 1,
        "pageSize": 10
      }
    }
    ```

#### 3.2.2 创建用户

- **功能描述**：创建新用户
- **接口定义**：
  - 请求方式：POST
  - 接口路径：/api/system/users
  - 请求参数：
    ```json
    {
      "username": "string",
      "password": "string",
      "nickname": "string",
      "email": "string",
      "phone": "string",
      "status": 1,
      "roleIds": [1, 2],
      "deptIds": [1, 2],
      "primaryDeptId": 1
    }
    ```
  - 响应结果：
    ```json
    {
      "code": 200,
      "message": "success",
      "data": {
        "id": 1
      }
    }
    ```

#### 3.2.3 更新用户

- **功能描述**：更新用户信息
- **接口定义**：
  - 请求方式：POST
  - 接口路径：/api/system/users/{id}
  - 请求参数：
    ```json
    {
      "nickname": "string",
      "email": "string",
      "phone": "string",
      "status": 1,
      "roleIds": [1, 2],
      "deptIds": [1, 2],
      "primaryDeptId": 1
    }
    ```
  - 响应结果：
    ```json
    {
      "code": 200,
      "message": "success",
      "data": true
    }
    ```

#### 3.2.4 删除用户

- **功能描述**：删除用户
- **接口定义**：
  - 请求方式：POST
  - 接口路径：/api/system/users/delete/{id}
  - 请求参数：无
  - 响应结果：
    ```json
    {
      "code": 200,
      "message": "success",
      "data": true
    }
    ```

#### 3.2.5 重置密码

- **功能描述**：重置用户密码
- **接口定义**：
  - 请求方式：POST
  - 接口路径：/api/system/users/reset-password/{id}
  - 请求参数：
    ```json
    {
      "password": "string"
    }
    ```
  - 响应结果：
    ```json
    {
      "code": 200,
      "message": "success",
      "data": true
    }
    ```

### 3.3 部门管理模块

#### 3.3.1 部门列表

- **功能描述**：获取部门树形结构
- **接口定义**：
  - 请求方式：GET
  - 接口路径：/api/system/depts
  - 请求参数：
    ```
    name: 部门名称（可选）
    status: 状态（可选）
    ```
  - 响应结果：
    ```json
    {
      "code": 200,
      "message": "success",
      "data": [
        {
          "id": 1,
          "name": "总公司",
          "parentId": 0,
          "sort": 1,
          "status": 1,
          "createTime": "2023-01-01 00:00:00",
          "children": [
            {
              "id": 2,
              "name": "研发部",
              "parentId": 1,
              "sort": 1,
              "status": 1,
              "createTime": "2023-01-01 00:00:00",
              "children": []
            }
          ]
        }
      ]
    }
    ```

#### 3.3.2 创建部门

- **功能描述**：创建新部门
- **接口定义**：
  - 请求方式：POST
  - 接口路径：/api/system/depts
  - 请求参数：
    ```json
    {
      "name": "string",
      "parentId": 0,
      "sort": 1,
      "status": 1
    }
    ```
  - 响应结果：
    ```json
    {
      "code": 200,
      "message": "success",
      "data": {
        "id": 1
      }
    }
    ```

#### 3.3.3 更新部门

- **功能描述**：更新部门信息
- **接口定义**：
  - 请求方式：POST
  - 接口路径：/api/system/depts/{id}
  - 请求参数：
    ```json
    {
      "name": "string",
      "parentId": 0,
      "sort": 1,
      "status": 1
    }
    ```
  - 响应结果：
    ```json
    {
      "code": 200,
      "message": "success",
      "data": true
    }
    ```

#### 3.3.4 删除部门

- **功能描述**：删除部门
- **接口定义**：
  - 请求方式：POST
  - 接口路径：/api/system/depts/delete/{id}
  - 请求参数：无
  - 响应结果：
    ```json
    {
      "code": 200,
      "message": "success",
      "data": true
    }
    ```

### 3.4 角色管理模块

#### 3.4.1 角色列表

- **功能描述**：分页查询角色列表
- **接口定义**：
  - 请求方式：GET
  - 接口路径：/api/system/roles
  - 请求参数：
    ```
    page: 页码
    pageSize: 每页条数
    name: 角色名称（可选）
    code: 角色编码（可选）
    status: 状态（可选）
    ```
  - 响应结果：
    ```json
    {
      "code": 200,
      "message": "success",
      "data": {
        "list": [
          {
            "id": 1,
            "name": "超级管理员",
            "code": "admin",
            "status": 1,
            "remark": "拥有所有权限",
            "createTime": "2023-01-01 00:00:00"
          }
        ],
        "total": 10,
        "page": 1,
        "pageSize": 10
      }
    }
    ```

#### 3.4.2 创建角色

- **功能描述**：创建新角色
- **接口定义**：
  - 请求方式：POST
  - 接口路径：/api/system/roles
  - 请求参数：
    ```json
    {
      "name": "string",
      "code": "string",
      "status": 1,
      "remark": "string",
      "resources": [
        {
          "resourceId": "user-management",
          "actions": ["view", "add", "edit", "delete"]
        }
      ]
    }
    ```
  - 响应结果：
    ```json
    {
      "code": 200,
      "message": "success",
      "data": {
        "id": 1
      }
    }
    ```

#### 3.4.3 更新角色

- **功能描述**：更新角色信息
- **接口定义**：
  - 请求方式：POST
  - 接口路径：/api/system/roles/{id}
  - 请求参数：
    ```json
    {
      "name": "string",
      "code": "string",
      "status": 1,
      "remark": "string",
      "resources": [
        {
          "resourceId": "user-management",
          "actions": ["view", "add", "edit", "delete"]
        }
      ]
    }
    ```
  - 响应结果：
    ```json
    {
      "code": 200,
      "message": "success",
      "data": true
    }
    ```

#### 3.4.4 删除角色

- **功能描述**：删除角色
- **接口定义**：
  - 请求方式：POST
  - 接口路径：/api/system/roles/delete/{id}
  - 请求参数：无
  - 响应结果：
    ```json
    {
      "code": 200,
      "message": "success",
      "data": true
    }
    ```

#### 3.4.5 获取角色权限

- **功能描述**：获取角色的权限资源列表
- **接口定义**：
  - 请求方式：GET
  - 接口路径：/api/system/roles/{id}/resources
  - 请求参数：无
  - 响应结果：
    ```json
    {
      "code": 200,
      "message": "success",
      "data": {
        "roleId": 1,
        "roleName": "admin",
        "resources": [
          {
            "resourceId": "user-management",
            "actions": ["view", "add", "edit", "delete"]
          },
          {
            "resourceId": "order-management",
            "actions": ["view", "export"]
          }
        ]
      }
    }
    ```

#### 3.4.6 分配角色权限

- **功能描述**：为角色分配权限资源
- **接口定义**：
  - 请求方式：POST
  - 接口路径：/api/system/roles/{id}/resources
  - 请求参数：
    ```json
    {
      "resources": [
        {
          "resourceId": "user-management",
          "actions": ["view", "add", "edit", "delete"]
        },
        {
          "resourceId": "order-management",
          "actions": ["view", "export"]
        }
      ]
    }
    ```
  - 响应结果：
    ```json
    {
      "code": 200,
      "message": "success",
      "data": true
    }
    ```

### 3.5 菜单路由管理模块

#### 3.5.1 菜单列表

- **功能描述**：获取菜单树形结构
- **接口定义**：
  - 请求方式：GET
  - 接口路径：/api/system/menus
  - 请求参数：
    ```
    name: 菜单名称（可选）
    status: 状态（可选）
    ```
  - 响应结果：
    ```json
    {
      "code": 200,
      "message": "success",
      "data": [
        {
          "id": 1,
          "name": "Dashboard",
          "path": "/dashboard",
          "component": "dashboard/index",
          "parentId": 0,
          "icon": "Odometer",
          "sort": 1,
          "status": 1,
          "type": 1,
          "createTime": "2023-01-01 00:00:00",
          "children": []
        },
        {
          "id": 2,
          "name": "系统管理",
          "path": "/system",
          "component": "Layout",
          "parentId": 0,
          "icon": "Setting",
          "sort": 2,
          "status": 1,
          "type": 1,
          "createTime": "2023-01-01 00:00:00",
          "children": [
            {
              "id": 3,
              "name": "用户管理",
              "path": "user",
              "component": "system/user/index",
              "parentId": 2,
              "icon": "User",
              "sort": 1,
              "status": 1,
              "type": 1,
              "createTime": "2023-01-01 00:00:00",
              "children": []
            }
          ]
        }
      ]
    }
    ```

#### 3.5.2 创建菜单

- **功能描述**：创建新菜单
- **接口定义**：
  - 请求方式：POST
  - 接口路径：/api/system/menus
  - 请求参数：
    ```json
    {
      "name": "string",
      "path": "string",
      "component": "string",
      "parentId": 0,
      "icon": "string",
      "sort": 1,
      "status": 1,
      "type": 1
    }
    ```
  - 响应结果：
    ```json
    {
      "code": 200,
      "message": "success",
      "data": {
        "id": 1
      }
    }
    ```

#### 3.5.3 更新菜单

- **功能描述**：更新菜单信息
- **接口定义**：
  - 请求方式：POST
  - 接口路径：/api/system/menus/{id}
  - 请求参数：
    ```json
    {
      "name": "string",
      "path": "string",
      "component": "string",
      "parentId": 0,
      "icon": "string",
      "sort": 1,
      "status": 1,
      "type": 1
    }
    ```
  - 响应结果：
    ```json
    {
      "code": 200,
      "message": "success",
      "data": true
    }
    ```

#### 3.5.4 删除菜单

- **功能描述**：删除菜单
- **接口定义**：
  - 请求方式：POST
  - 接口路径：/api/system/menus/delete/{id}
  - 请求参数：无
  - 响应结果：
    ```json
    {
      "code": 200,
      "message": "success",
      "data": true
    }
    ```

#### 3.5.5 获取用户菜单

- **功能描述**：获取当前登录用户的菜单列表，用于动态生成前端路由
- **接口定义**：
  - 请求方式：GET
  - 接口路径：/api/user/menus
  - 请求参数：无
  - 响应结果：
    ```json
    {
      "code": 200,
      "message": "success",
      "data": [
        {
          "path": "/dashboard",
          "component": "dashboard/index",
          "name": "Dashboard",
          "meta": {
            "title": "Dashboard",
            "icon": "Odometer",
            "keepAlive": true
          }
        },
        {
          "path": "/system",
          "component": "Layout",
          "name": "System",
          "meta": {
            "title": "系统管理",
            "icon": "Setting"
          },
          "children": [
            {
              "path": "user",
              "component": "system/user/index",
              "name": "User",
              "meta": {
                "title": "用户管理",
                "icon": "User"
              }
            }
          ]
        }
      ]
    }
    ```
  ### 3.6 字典管理模块

#### 3.6.1 字典类型列表

- **功能描述**：分页查询字典类型列表
- **接口定义**：
  - 请求方式：GET
  - 接口路径：/api/system/dict/types
  - 请求参数：
    ```
    page: 页码
    pageSize: 每页条数
    name: 字典名称（可选）
    type: 字典类型（可选）
    status: 状态（可选）
    ```
  - 响应结果：
    ```json
    {
      "code": 200,
      "message": "success",
      "data": {
        "list": [
          {
            "id": 1,
            "name": "用户状态",
            "type": "sys_user_status",
            "status": 1,
            "remark": "用户状态列表",
            "createTime": "2023-01-01 00:00:00"
          }
        ],
        "total": 10,
        "page": 1,
        "pageSize": 10
      }
    }
    ```

#### 3.6.2 字典数据列表

- **功能描述**：根据字典类型查询字典数据列表
- **接口定义**：
  - 请求方式：GET
  - 接口路径：/api/system/dict/data
  - 请求参数：
    ```
    dictType: 字典类型
    ```
  - 响应结果：
    ```json
    {
      "code": 200,
      "message": "success",
      "data": [
        {
          "id": 1,
          "dictTypeId": 1,
          "dictType": "sys_user_status",
          "label": "正常",
          "value": "1",
          "sort": 1,
          "status": 1,
          "remark": "正常状态",
          "createTime": "2023-01-01 00:00:00"
        },
        {
          "id": 2,
          "dictTypeId": 1,
          "dictType": "sys_user_status",
          "label": "禁用",
          "value": "0",
          "sort": 2,
          "status": 1,
          "remark": "禁用状态",
          "createTime": "2023-01-01 00:00:00"
        }
      ]
    }
    ```

#### 3.6.3 创建字典类型

- **功能描述**：创建新字典类型
- **接口定义**：
  - 请求方式：POST
  - 接口路径：/api/system/dict/types
  - 请求参数：
    ```json
    {
      "name": "string",
      "type": "string",
      "status": 1,
      "remark": "string"
    }
    ```
  - 响应结果：
    ```json
    {
      "code": 200,
      "message": "success",
      "data": {
        "id": 1,
        "name": "用户状态",
        "type": "sys_user_status",
        "status": 1,
        "remark": "用户状态列表",
        "createTime": "2023-01-01 00:00:00"
      }
    }
    ```

#### 3.6.4 创建字典数据

- **功能描述**：创建新字典数据
- **接口定义**：
  - 请求方式：POST
  - 接口路径：/api/system/dict/data
  - 请求参数：
    ```json
    {
      "dictTypeId": 1,
      "dictType": "string",
      "label": "string",
      "value": "string",
      "sort": 1,
      "status": 1,
      "remark": "string"
    }
    ```
  - 响应结果：
    ```json
    {
      "code": 200,
      "message": "success",
      "data": {
        "id": 1,
        "dictTypeId": 1,
        "dictType": "sys_user_status",
        "label": "正常",
        "value": "1",
        "sort": 1,
        "status": 1,
        "remark": "正常状态",
        "createTime": "2023-01-01 00:00:00"
      }
    }
    ```

### 3.7 文件上传管理模块

#### 3.7.1 文件上传

- **功能描述**：上传文件到服务器
- **接口定义**：
  - 请求方式：POST
  - 接口路径：/api/system/files/upload
  - 请求参数：multipart/form-data 格式
    ```
    file: 文件对象
    ```
  - 响应结果：
    ```json
    {
      "code": 200,
      "message": "success",
      "data": {
        "id": 1,
        "fileName": "example.jpg",
        "originalName": "example.jpg",
        "fileUrl": "/uploads/2023/01/01/example.jpg",
        "fileSize": 1024,
        "fileType": "image/jpeg",
        "uploadTime": "2023-01-01 00:00:00"
      }
    }
    ```

#### 3.7.2 文件列表

- **功能描述**：分页查询文件列表
- **接口定义**：
  - 请求方式：GET
  - 接口路径：/api/system/files
  - 请求参数：
    ```
    page: 页码
    pageSize: 每页条数
    fileName: 文件名（可选）
    fileType: 文件类型（可选）
    startTime: 开始时间（可选）
    endTime: 结束时间（可选）
    ```
  - 响应结果：
    ```json
    {
      "code": 200,
      "message": "success",
      "data": {
        "list": [
          {
            "id": 1,
            "fileName": "example.jpg",
            "originalName": "example.jpg",
            "fileUrl": "/uploads/2023/01/01/example.jpg",
            "fileSize": 1024,
            "fileType": "image/jpeg",
            "uploadTime": "2023-01-01 00:00:00"
          }
        ],
        "total": 100,
        "page": 1,
        "pageSize": 10
      }
    }
    ```

#### 3.7.3 删除文件

- **功能描述**：删除文件
- **接口定义**：
  - 请求方式：POST
  - 接口路径：/api/system/files/delete/{id}
  - 请求参数：无
  - 响应结果：
    ```json
    {
      "code": 200,
      "message": "success",
      "data": true
    }
    ```

### 3.8 操作日志管理模块

#### 3.8.1 操作日志列表

- **功能描述**：分页查询操作日志列表
- **接口定义**：
  - 请求方式：GET
  - 接口路径：/api/system/logs/operation
  - 请求参数：
    ```
    page: 页码
    pageSize: 每页条数
    username: 操作用户（可选）
    operation: 操作内容（可选）
    status: 操作状态（可选）
    startTime: 开始时间（可选）
    endTime: 结束时间（可选）
    ```
  - 响应结果：
    ```json
    {
      "code": 200,
      "message": "success",
      "data": {
        "list": [
          {
            "id": 1,
            "username": "admin",
            "operation": "用户登录",
            "method": "POST",
            "requestUrl": "/api/login",
            "requestMethod": "com.example.controller.AuthController.login",
            "requestParams": "{\"username\":\"admin\",\"password\":\"******\"}",
            "requestIp": "127.0.0.1",
            "status": 1,
            "errorMsg": "",
            "operationTime": "2023-01-01 00:00:00",
            "duration": 123
          }
        ],
        "total": 1000,
        "page": 1,
        "pageSize": 10
      }
    }
    ```

#### 3.8.2 登录日志列表

- **功能描述**：分页查询登录日志列表
- **接口定义**：
  - 请求方式：GET
  - 接口路径：/api/system/logs/login
  - 请求参数：
    ```
    page: 页码
    pageSize: 每页条数
    username: 用户名（可选）
    status: 状态（可选）
    startTime: 开始时间（可选）
    endTime: 结束时间（可选）
    ```
  - 响应结果：
    ```json
    {
      "code": 200,
      "message": "success",
      "data": {
        "list": [
          {
            "id": 1,
            "username": "admin",
            "status": 1,
            "ipAddress": "127.0.0.1",
            "loginLocation": "内网IP",
            "browser": "Chrome",
            "os": "Windows 10",
            "loginTime": "2023-01-01 00:00:00",
            "message": "登录成功"
          }
        ],
        "total": 1000,
        "page": 1,
        "pageSize": 10
      }
    }
    ```

### 3.9 权限数据缓存模块

#### 3.9.1 缓存设计

- **功能描述**：使用Redis缓存权限数据，减少数据库访问，提高系统性能
- **缓存内容**：
  - 用户权限数据
  - 角色权限数据
  - 菜单路由数据
  - 字典数据
- **缓存策略**：
  - 缓存时间：默认24小时
  - 缓存更新：当相关数据发生变更时，自动更新缓存
  - 缓存前缀：使用统一的前缀区分不同类型的缓存数据\
- ** 缓存失效策略**：
  1. 用户权限缓存：
  - 用户角色变更时，主动清除该用户权限缓存
  - 当角色权限变更时，主动清除所有关联该角色的用户权限缓存
  - 当菜单或资源变更时，清除所有用户权限缓存
  2. 字典数据缓存：
  - 字典数据更新时，仅清除对应类型的字典缓存
  - 字典类型删除时，清除所有关联该类型的字典数据缓存
  3. 部门数据缓存：
  - 部门数据变更时，清除部门树缓存，不影响用户权限缓存
  4. 防缓存雪崩：
  - 缓存过期时间添加随机因子，避免同时失效
  - 实现缓存降级和熔断机制，防止缓存故障影响系统运行

#### 3.9.2 缓存刷新

- **功能描述**：手动刷新系统缓存
- **接口定义**：
  - 请求方式：POST
  - 接口路径：/api/system/cache/refresh
  - 请求参数：
    ```json
    {
      "cacheType": "string" // 缓存类型：all, user, role, menu, dict
    }
    ```
  - 响应结果：
    ```json
    {
      "code": 200,
      "message": "success",
      "data": true
    }
    ```

## 4. 接口设计规范

### 4.1 统一响应格式

所有接口统一使用以下响应格式：

```json
{
  "code": 200, // 状态码：200成功，非200表示失败
  "message": "success", // 响应消息
  "data": {} // 响应数据
}
```

#### 4.1.1 响应数据规范

- **创建操作**：返回新创建对象的ID

  ```json
  { "data": { "id": 1 } }
  ```

- **更新操作**：返回布尔值表示成功或失败

  ```json
  { "data": true }
  ```

- **删除操作**：返回布尔值表示成功或失败

  ```json
  { "data": true }
  ```

- **查询操作**：返回查询结果对象或列表

### 4.2 接口命名规范

- **RESTful风格**：使用资源名词复数形式
- **URL路径**：使用kebab-case命名法（小写字母，单词间用连字符分隔）
- **请求方法**：
  - GET：查询操作
  - POST：创建和更新操作
  - 删除操作（使用POST /xxx/delete/{id}）

### 4.3 接口参数规范

- **查询参数**：使用URL查询参数（Query Parameters）
- **创建/更新参数**：使用JSON格式请求体（Request Body）

### 4.4 全局错误码表

| 错误码 | 错误信息           | 说明             |
| ------ | ------------------ | ---------------- |
| 200    | success            | 操作成功         |
| 400    | Bad Request        | 请求参数错误     |
| 401    | Unauthorized       | 未授权（未登录） |
| 403    | Forbidden          | 权限不足         |
| 404    | Not Found          | 资源不存在       |
| 405    | Method Not Allowed | 请求方法不允许   |
| 429    | Too Many Requests  | 请求频率超限     |
| 500    | Server Error       | 服务器内部错误   |
| 1001   | User Not Exist     | 用户不存在       |
| 1002   | Password Error     | 密码错误         |
| 1003   | Username Existed   | 用户名已存在     |
| 1004   | Role Not Exist     | 角色不存在       |
| 1005   | Dept Not Exist     | 部门不存在       |
| 1006   | Menu Not Exist     | 菜单不存在       |

### 4.5 接口安全增强

#### 4.5.1 限流方案

系统采用多级限流策略：

1. 全局限流：基于IP地址，默认每IP每秒最多100次请求
2. 接口限流：针对特定接口，如登录接口每IP每分钟最多5次
3. 用户限流：针对已登录用户，默认每用户每秒最多50次请求

技术实现：

1. 使用Guava RateLimiter实现单机限流
2. Redis+Lua脚本实现分布式限流
3. 通过注解方式灵活配置限流规则

```java
@RateLimit(limit = 5, period = 60)  // 限制每60秒内最多5次请求
@GetMapping("/sensitive-api")
public Result sensitiveApi() {
    // 业务逻辑
}
```

#### 4.5.2 CSRF防护策略

前后端分离架构下的CSRF防护策略：

1. 登录成功后生成CSRF Token，并在响应头中返回
2. 前端存储Token并在后续请求中通过自定义请求头传递
3. 服务端校验Token有效性

#### 4.5.3 白名单路由

以下接口不需要进行token验证：

1. /api/login - 登录接口
2. /api/captcha - 验证码接口
3. /api/register - 注册接口（如系统支持自注册）
4. /api/reset-password - 重置密码接口
5. /api/swagger-ui/\*\* - Swagger文档
6. /api/v3/api-docs/\*\* - OpenAPI文档
7. /api/actuator/health - 健康检查接口

## 5. 数据模型设计

### 5.1 用户表(sys_user)

| 字段名      | 类型         | 说明                      |
| ----------- | ------------ | ------------------------- |
| id          | bigint       | 主键ID                    |
| username    | varchar(50)  | 用户名（唯一索引）        |
| password    | varchar(100) | 密码（BCrypt加密）        |
| nickname    | varchar(50)  | 昵称                      |
| email       | varchar(100) | 邮箱（AES加密）           |
| phone       | varchar(20)  | 手机号（AES加密）         |
| avatar      | varchar(255) | 头像URL                   |
| status      | tinyint      | 状态（0禁用 1正常 2锁定） |
| create_time | datetime     | 创建时间                  |
| update_time | datetime     | 更新时间                  |
| create_by   | varchar(50)  | 创建者用户名              |
| update_by   | varchar(50)  | 更新者用户名              |
| remark      | varchar(255) | 备注                      |
| deleted     | tinyint      | 是否删除（0否 1是）       |

### 5.2 角色表(sys_role)

| 字段名      | 类型         | 说明                |
| ----------- | ------------ | ------------------- |
| id          | bigint       | 主键ID              |
| name        | varchar(50)  | 角色名称            |
| code        | varchar(50)  | 角色编码            |
| status      | tinyint      | 状态（1正常 0禁用） |
| create_time | datetime     | 创建时间            |
| update_time | datetime     | 更新时间            |
| create_by   | varchar(50)  | 创建者              |
| update_by   | varchar(50)  | 更新者              |
| remark      | varchar(255) | 备注                |
| deleted     | tinyint      | 是否删除（1是 0否） |

### 5.3 角色资源表(sys_role_resource)

| 字段名      | 类型        | 说明                             |
| ----------- | ----------- | -------------------------------- |
| id          | bigint      | 主键ID                           |
| role_id     | bigint      | 角色ID                           |
| resource_id | varchar(50) | 资源ID                           |
| action      | varchar(50) | 操作权限（view/add/edit/delete） |

### 5.4 部门表(sys_dept)

| 字段名      | 类型        | 说明                |
| ----------- | ----------- | ------------------- |
| id          | bigint      | 主键ID              |
| name        | varchar(50) | 部门名称            |
| parent_id   | bigint      | 父部门ID            |
| sort        | int         | 排序                |
| status      | tinyint     | 状态（1正常 0禁用） |
| create_time | datetime    | 创建时间            |
| update_time | datetime    | 更新时间            |
| create_by   | varchar(50) | 创建者              |
| update_by   | varchar(50) | 更新者              |
| deleted     | tinyint     | 是否删除（1是 0否） |

### 5.5 用户-角色关联表(sys_user_role)

| 字段名  | 类型   | 说明               |
| ------- | ------ | ------------------ |
| id      | bigint | 主键ID             |
| user_id | bigint | 用户ID（复合索引） |
| role_id | bigint | 角色ID（复合索引） |

### 5.6 用户-部门关联表(sys_user_dept)

| 字段名     | 类型    | 说明                  |
| ---------- | ------- | --------------------- |
| id         | bigint  | 主键ID                |
| user_id    | bigint  | 用户ID（复合索引）    |
| dept_id    | bigint  | 部门ID（复合索引）    |
| is_primary | tinyint | 是否主部门（0否 1是） |

### 5.7 菜单表(sys_menu)

| 字段名      | 类型         | 说明                 |
| ----------- | ------------ | -------------------- |
| id          | bigint       | 主键ID               |
| name        | varchar(50)  | 菜单名称             |
| path        | varchar(100) | 路由路径             |
| component   | varchar(100) | 组件路径             |
| parent_id   | bigint       | 父菜单ID（普通索引） |
| icon        | varchar(50)  | 图标                 |
| sort        | int          | 排序                 |
| status      | tinyint      | 状态（0禁用 1正常）  |
| type        | tinyint      | 类型（1菜单 2按钮）  |
| permission  | varchar(100) | 权限标识             |
| create_time | datetime     | 创建时间             |
| update_time | datetime     | 更新时间             |
| create_by   | varchar(50)  | 创建者               |
| update_by   | varchar(50)  | 更新者               |
| deleted     | tinyint      | 是否删除（0否 1是）  |

### 5.8 字典类型表(sys_dict_type)

| 字段名      | 类型         | 说明                 |
| ----------- | ------------ | -------------------- |
| id          | bigint       | 主键ID               |
| name        | varchar(50)  | 字典名称             |
| type        | varchar(50)  | 字典类型（唯一索引） |
| status      | tinyint      | 状态（0禁用 1正常）  |
| create_time | datetime     | 创建时间             |
| update_time | datetime     | 更新时间             |
| create_by   | varchar(50)  | 创建者               |
| update_by   | varchar(50)  | 更新者               |
| remark      | varchar(255) | 备注                 |
| deleted     | tinyint      | 是否删除（0否 1是）  |

### 5.9 字典数据表(sys_dict_data)

| 字段名       | 类型         | 说明                 |
| ------------ | ------------ | -------------------- |
| id           | bigint       | 主键ID               |
| dict_type_id | bigint       | 字典类型ID           |
| dict_type    | varchar(50)  | 字典类型（普通索引） |
| label        | varchar(50)  | 字典标签             |
| value        | varchar(50)  | 字典值               |
| sort         | int          | 排序                 |
| status       | tinyint      | 状态（0禁用 1正常）  |
| create_time  | datetime     | 创建时间             |
| update_time  | datetime     | 更新时间             |
| create_by    | varchar(50)  | 创建者               |
| update_by    | varchar(50)  | 更新者               |
| remark       | varchar(255) | 备注                 |
| deleted      | tinyint      | 是否删除（0否 1是）  |

### 5.10 文件信息表(sys_file)

| 字段名        | 类型         | 说明                 |
| ------------- | ------------ | -------------------- |
| id            | bigint       | 主键ID               |
| file_name     | varchar(100) | 文件名               |
| original_name | varchar(100) | 原始文件名           |
| file_url      | varchar(255) | 文件URL              |
| file_size     | bigint       | 文件大小（字节）     |
| file_type     | varchar(50)  | 文件类型（普通索引） |
| upload_time   | datetime     | 上传时间（普通索引） |
| upload_by     | varchar(50)  | 上传者               |
| deleted       | tinyint      | 是否删除（0否 1是）  |

### 5.11 操作日志表(sys_operation_log)

| 字段名         | 类型         | 说明                     |
| -------------- | ------------ | ------------------------ |
| id             | bigint       | 主键ID                   |
| username       | varchar(50)  | 操作用户（普通索引）     |
| operation      | varchar(100) | 操作内容                 |
| method         | varchar(10)  | 请求方法                 |
| request_url    | varchar(255) | 请求URL（普通索引）      |
| request_method | varchar(100) | 请求方法                 |
| request_params | text         | 请求参数（敏感信息脱敏） |
| request_ip     | varchar(50)  | 请求IP                   |
| status         | tinyint      | 状态（1成功 0失败）      |
| error_msg      | text         | 错误消息                 |
| operation_time | datetime     | 操作时间（普通索引）     |
| duration       | int          | 执行时长（毫秒）         |

### 5.12 登录日志表(sys_login_log)

| 字段名         | 类型         | 说明                 |
| -------------- | ------------ | -------------------- |
| id             | bigint       | 主键ID               |
| username       | varchar(50)  | 用户名（普通索引）   |
| status         | tinyint      | 状态（1成功 0失败）  |
| ip_address     | varchar(50)  | IP地址（AES加密）    |
| login_location | varchar(100) | 登录地点             |
| browser        | varchar(50)  | 浏览器               |
| os             | varchar(50)  | 操作系统             |
| login_time     | datetime     | 登录时间（普通索引） |
| message        | varchar(255) | 消息                 |

## 6. 权限控制设计

### 6.1 RBAC权限模型

本系统采用基于角色的访问控制（RBAC）模型，并进行了扩展，主要包括以下几个核心概念：

- **用户（User）**：系统的使用者，每个用户可以关联多个角色和多个部门。
- **角色（Role）**：权限的集合，定义了用户可以执行的操作。
- **部门（Department）**：组织架构单元，用户可以属于多个部门。
- **资源（Resource）**：系统中的功能模块或数据对象。
- **操作（Action）**：对资源可以执行的具体操作，如查看、新增、编辑、删除等。

### 6.2 权限数据结构

#### 6.2.1 用户-角色-权限关系

```json
{
  "userId": 1,
  "roles": [
    {
      "roleId": 1,
      "roleName": "admin",
      "resources": [
        {
          "resourceId": "user-management",
          "actions": ["view", "add", "edit", "delete"]
        }
      ]
    },
    {
      "roleId": 2,
      "roleName": "manager",
      "resources": [
        {
          "resourceId": "order-management",
          "actions": ["view", "export"]
        }
      ]
    }
  ]
}
```

#### 6.2.2 用户-部门关系

```json
{
  "userId": 1,
  "departments": [
    {
      "deptId": 1,
      "deptName": "总公司",
      "isPrimary": true
    },
    {
      "deptId": 2,
      "deptName": "研发部",
      "isPrimary": false
    }
  ]
}
```

### 6.3 权限控制流程

1. 用户登录系统，获取JWT令牌
2. 系统加载用户关联的所有角色信息
3. 合并所有角色的权限资源列表（权限取并集）
4. 将合并后的权限数据缓存到Redis中
5. 用户访问接口时，系统检查用户是否有权限执行该操作
6. 前端根据用户权限动态生成菜单和按钮
7. 对于数据权限，根据用户所属部门进行数据过滤

### 6.4 权限注解设计

使用Spring Security的注解进行权限控制(自定义SpEL表达式:)：

```java
// 控制器方法上的权限注解
@PreAuthorize("hasResourceAction('user-management', 'view')")
public ResponseEntity<List<User>> getUserList() {
    // 业务逻辑
}
```

## 6. 系统安全设计

### 6.1 认证机制

- 基于JWT的无状态认证
- Token过期时间：默认2小时
- 刷新Token机制：Token即将过期时自动刷新

### 6.2 密码安全

- 密码加密：使用BCrypt加密算法
- 密码策略：强制要求包含大小写字母、数字和特殊字符
- 密码过期：支持设置密码有效期

### 6.3 接口安全

- 接口幂等性：防止重复提交
- 接口限流：防止恶意请求
- CSRF防护：防止跨站请求伪造
- XSS防护：防止跨站脚本攻击

## 7. 系统性能优化

### 7.1 缓存策略

- 使用Redis缓存权限数据、字典数据等
- 缓存更新策略：更新数据时自动刷新缓存
- 缓存过期策略：设置合理的过期时间

### 7.2 数据库优化

- 索引优化：为常用查询字段创建索引
- SQL优化：避免全表扫描，使用分页查询
- 连接池配置：合理设置连接池大小

### 7.3 接口响应优化

- 数据压缩：启用Gzip压缩
- 接口分页：大数据量接口强制分页
- 异步处理：耗时操作异步执行

## 8. 系统部署方案

### 8.1 开发环境

- JDK 17+
- Maven 3.8+
- MySQL 8.0+
- Redis 6.0+
- IDE：IntelliJ IDEA或Eclipse

### 8.2 部署架构

- 应用服务器：2台（负载均衡）
- 数据库服务器：主从架构（1主1从）
- Redis服务器：主从架构（1主1从）
- 文件存储服务器：1台

### 8.3 部署步骤

1. 准备服务器环境
2. 安装必要的软件（JDK、MySQL、Redis等）
3. 创建数据库并导入初始数据
4. 配置应用参数
5. 打包应用并部署
6. 配置Nginx负载均衡
7. 启动应用并验证

## 9. 数据库设计

### 9.1 ER图

[此处插入ER图]

### 9.2 核心表结构

#### 9.2.1 用户表（sys_user）

| 字段名      | 类型         | 说明     |
| ----------- | ------------ | -------- |
| id          | bigint       | 主键     |
| username    | varchar(50)  | 用户名   |
| password    | varchar(100) | 密码     |
| nickname    | varchar(50)  | 昵称     |
| email       | varchar(100) | 邮箱     |
| phone       | varchar(20)  | 手机号   |
| status      | tinyint      | 状态     |
| create_time | datetime     | 创建时间 |
| update_time | datetime     | 更新时间 |

#### 9.2.2 角色表（sys_role）

| 字段名      | 类型         | 说明     |
| ----------- | ------------ | -------- |
| id          | bigint       | 主键     |
| name        | varchar(50)  | 角色名称 |
| code        | varchar(50)  | 角色编码 |
| status      | tinyint      | 状态     |
| remark      | varchar(255) | 备注     |
| create_time | datetime     | 创建时间 |
| update_time | datetime     | 更新时间 |

#### 9.2.3 部门表（sys_dept）

| 字段名      | 类型        | 说明     |
| ----------- | ----------- | -------- |
| id          | bigint      | 主键     |
| name        | varchar(50) | 部门名称 |
| parent_id   | bigint      | 父部门ID |
| sort        | int         | 排序     |
| status      | tinyint     | 状态     |
| create_time | datetime    | 创建时间 |
| update_time | datetime    | 更新时间 |

#### 9.2.4 用户-角色关联表（sys_user_role）

| 字段名  | 类型   | 说明   |
| ------- | ------ | ------ |
| id      | bigint | 主键   |
| user_id | bigint | 用户ID |
| role_id | bigint | 角色ID |

#### 9.2.5 用户-部门关联表（sys_user_dept）

| 字段名     | 类型    | 说明       |
| ---------- | ------- | ---------- |
| id         | bigint  | 主键       |
| user_id    | bigint  | 用户ID     |
| dept_id    | bigint  | 部门ID     |
| is_primary | tinyint | 是否主部门 |

## 10. 系统扩展性设计

### 10.1 插件化设计

- 系统提供了插件化扩展机制，方便根据业务需求进行扩展。

### 10.2 模块化设计

- 系统模块划分清晰，易于维护和扩展。

### 10.3 可配置化

- 系统参数可配置，方便根据业务需求进行调整。

### 10.4 可扩展性

- 系统提供了插件化扩展机制，方便根据业务需求进行扩展。

### 10.5 可维护性

- 系统模块划分清晰，易于维护和扩展。
