// Storage工具封装，支持localStorage/sessionStorage、泛型、过期时间、命名空间

interface StorageValue<T> {
  value: T
  expiry?: number // 时间戳，毫秒
}

interface StorageOptions {
  namespace?: string // 命名空间，可选
  useSession?: boolean // 是否使用sessionStorage，默认false使用localStorage
}

class StorageUtil {
  private static getStorage(useSession?: boolean): Storage {
    return useSession ? sessionStorage : localStorage
  }

  private static buildKey(key: string, namespace?: string): string {
    return namespace ? `${namespace}:${key}` : key
  }

  static set<T>(key: string, value: T, ttl?: number, options?: StorageOptions): void {
    const { namespace, useSession } = options || {}
    const storage = this.getStorage(useSession)
    const item: StorageValue<T> = {
      value,
      expiry: ttl ? Date.now() + ttl : undefined,
    }
    try {
      storage.setItem(this.buildKey(key, namespace), JSON.stringify(item))
    } catch (error) {
      console.error(`Storage set失败：key=${key}`, error)
    }
  }

  static get<T>(key: string, options?: StorageOptions): T | null {
    const { namespace, useSession } = options || {}
    const storage = this.getStorage(useSession)
    const itemStr = storage.getItem(this.buildKey(key, namespace))
    if (!itemStr) {
      return null
    }

    try {
      const item: StorageValue<T> = JSON.parse(itemStr)
      if (item.expiry && Date.now() > item.expiry) {
        storage.removeItem(this.buildKey(key, namespace))
        return null
      }
      return item.value
    } catch (error) {
      console.error(`Storage get解析失败：key=${key}`, error)
      return null
    }
  }

  static remove(key: string, options?: StorageOptions): void {
    const { namespace, useSession } = options || {}
    const storage = this.getStorage(useSession)
    storage.removeItem(this.buildKey(key, namespace))
  }

  static clear(options?: { useSession?: boolean }): void {
    const { useSession } = options || {}
    const storage = this.getStorage(useSession)
    storage.clear()
  }

  static batchSet<T>(
    items: { key: string; value: T; ttl?: number }[],
    options?: StorageOptions,
  ): void {
    items.forEach((item) => {
      this.set(item.key, item.value, item.ttl, options)
    })
  }

  static batchGet<T>(keys: string[], options?: StorageOptions): Record<string, T | null> {
    const result: Record<string, T | null> = {}
    keys.forEach((key) => {
      result[key] = this.get<T>(key, options)
    })
    return result
  }

  static getAll<T>(options?: StorageOptions): Record<string, T> {
    const { namespace, useSession } = options || {}
    const storage = this.getStorage(useSession)
    const result: Record<string, T> = {}
    for (let i = 0; i < storage.length; i++) {
      const fullKey = storage.key(i)
      if (fullKey) {
        if (!namespace || fullKey.startsWith(namespace + ':')) {
          const pureKey = namespace ? fullKey.slice(namespace.length + 1) : fullKey
          const value = this.get<T>(pureKey, options)
          if (value !== null) {
            result[pureKey] = value
          }
        }
      }
    }
    return result
  }

  static searchKeys(keyword: string, options?: StorageOptions): string[] {
    const { namespace, useSession } = options || {}
    const storage = this.getStorage(useSession)
    const keys: string[] = []
    for (let i = 0; i < storage.length; i++) {
      const fullKey = storage.key(i)
      if (fullKey) {
        const matchNamespace = namespace ? fullKey.startsWith(namespace + ':') : true
        if (matchNamespace && fullKey.includes(keyword)) {
          const pureKey = namespace ? fullKey.slice(namespace.length + 1) : fullKey
          keys.push(pureKey)
        }
      }
    }
    return keys
  }

  static local = {
    set<T>(key: string, value: T, ttl?: number, namespace?: string) {
      StorageUtil.set(key, value, ttl, { namespace, useSession: false })
    },
    get<T>(key: string, namespace?: string) {
      return StorageUtil.get<T>(key, { namespace, useSession: false })
    },
    remove(key: string, namespace?: string) {
      StorageUtil.remove(key, { namespace, useSession: false })
    },
    clear() {
      StorageUtil.clear({ useSession: false })
    },
    batchSet<T>(items: { key: string; value: T; ttl?: number }[], namespace?: string) {
      StorageUtil.batchSet(items, { namespace, useSession: false })
    },
    batchGet<T>(keys: string[], namespace?: string) {
      return StorageUtil.batchGet<T>(keys, { namespace, useSession: false })
    },
    getAll<T>(namespace?: string) {
      return StorageUtil.getAll<T>({ namespace, useSession: false })
    },
    searchKeys(keyword: string, namespace?: string) {
      return StorageUtil.searchKeys(keyword, { namespace, useSession: false })
    },
  }

  static session = {
    set<T>(key: string, value: T, ttl?: number, namespace?: string) {
      StorageUtil.set(key, value, ttl, { namespace, useSession: true })
    },
    get<T>(key: string, namespace?: string) {
      return StorageUtil.get<T>(key, { namespace, useSession: true })
    },
    remove(key: string, namespace?: string) {
      StorageUtil.remove(key, { namespace, useSession: true })
    },
    clear() {
      StorageUtil.clear({ useSession: true })
    },
    batchSet<T>(items: { key: string; value: T; ttl?: number }[], namespace?: string) {
      StorageUtil.batchSet(items, { namespace, useSession: false })
    },
    batchGet<T>(keys: string[], namespace?: string) {
      return StorageUtil.batchGet<T>(keys, { namespace, useSession: false })
    },
    getAll<T>(namespace?: string) {
      return StorageUtil.getAll<T>({ namespace, useSession: false })
    },
    searchKeys(keyword: string, namespace?: string) {
      return StorageUtil.searchKeys(keyword, { namespace, useSession: false })
    },
  }
}

export default StorageUtil

// // 使用示例：

// // 1. 保存简单数据
// StorageUtil.set('username', 'Alice');
// StorageUtil.local.set('username', 'Alice');

// // 2. 读取简单数据
// const username = StorageUtil.get<string>('username');
// const usernameLocal = StorageUtil.local.get<string>('username');
// console.log(username, usernameLocal); // 输出: Alice Alice

// // 3. 保存对象并设置5分钟过期时间
// StorageUtil.set('userInfo', { id: 1, name: 'Alice' }, 5 * 60 * 1000);
// StorageUtil.local.set('userInfo', { id: 1, name: 'Alice' }, 5 * 60 * 1000);

// // 4. 从localStorage读取对象
// const userInfo = StorageUtil.get<{ id: number; name: string }>('userInfo');
// const userInfoLocal = StorageUtil.local.get<{ id: number; name: string }>('userInfo');
// console.log(userInfo, userInfoLocal);

// // 5. 使用命名空间保存
// StorageUtil.set('token', 'abcdef', undefined, { namespace: 'auth' });
// StorageUtil.local.set('token', 'abcdef', undefined, 'auth');

// // 6. 使用命名空间读取
// const token = StorageUtil.get<string>('token', { namespace: 'auth' });
// const tokenLocal = StorageUtil.local.get<string>('token', 'auth');
// console.log(token, tokenLocal);

// // 7. 使用sessionStorage保存数据
// StorageUtil.set('tempData', { foo: 'bar' }, undefined, { useSession: true });
// StorageUtil.session.set('tempData', { foo: 'bar' });

// // 8. 从sessionStorage读取数据
// const tempData = StorageUtil.get<{ foo: string }>('tempData', { useSession: true });
// const tempDataSession = StorageUtil.session.get<{ foo: string }>('tempData');
// console.log(tempData, tempDataSession);

// // 9. 删除指定key
// StorageUtil.remove('username');
// StorageUtil.local.remove('username');

// // 10. 清空localStorage或sessionStorage
// StorageUtil.clear(); // 清空localStorage
// StorageUtil.local.clear();
// StorageUtil.clear({ useSession: true }); // 清空sessionStorage
// StorageUtil.session.clear();
// // 批量设置
// StorageUtil.batchSet([
//   { key: 'user1', value: { name: 'Alice' } },
//   { key: 'user2', value: { name: 'Bob' }, ttl: 60000 },
// ], { namespace: 'user' });

// // 批量读取
// const users = StorageUtil.batchGet<{ name: string }>(['user1', 'user2'], { namespace: 'user' });
// console.log(users); // { user1: { name: 'Alice' }, user2: { name: 'Bob' } }

// // 获取所有key-value
// const allUsers = StorageUtil.getAll<{ name: string }>({ namespace: 'user' });
// console.log(allUsers);

// // 模糊搜索key
// const matchedKeys = StorageUtil.searchKeys('user', { namespace: 'user' });
// console.log(matchedKeys);
