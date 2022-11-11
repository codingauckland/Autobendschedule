/**
 * creXhr 创建 ajax 对象
 * @return { OBJECT } 当前浏览器使用的 ajax 对象
 */
 function creXhr() {
  var xhr = null
  var flag = false
  var arr = [
    function () { return new XMLHttpRequest() },
    function () { return new ActiveXObject('Microsoft.XMLHTTP') },
    function () { return new ActiveXObject('Msxml.XMLHTTP') },
    function () { return new ActiveXObject('Msxml2.XMLHTTP') }
  ]
  for (let i = 0; i < arr.length; i++) {
    try {
      xhr = arr[i]()
      creXhr = arr[i]
      flag = true
      break
    } catch (e) {}
  }
  if (!flag) {
    xhr = '您的浏览器不支持 ajax, 请更换浏览器重试'
    throw new Error(xhr)
  }
  return xhr
}


/**

/**
 * ajax 发送 ajax 请求的方法
 * @param { OBJECT } options 请求的所有配置项
 */
 function ajax(options = {}) {
    if (!options.url) {
      throw new Error('url 为必填选项')
    }
    if (!(options.type == undefined || options.type.toUpperCase() === 'GET' || options.type.toUpperCase() === 'POST')) {
      throw new Error('目前只接收 GET 或者 POST 请求方式, 请期待更新')
    }
    if (!(options.async == undefined || typeof options.async === 'boolean')) {
      throw new Error('async 需要一个 Boolean 数据类型')
    }
    if (!(options.dataType == undefined || options.dataType === 'string' || options.dataType === 'json')) {
      throw new Error('目前只支持 string 和 json 格式解析, 请期待更新')
    }
    if (!(options.data == undefined || typeof options.data === 'string' || Object.prototype.toString.call(options.data) === '[object Object]')) {
      throw new Error('data 参数只支持 string 和 object 数据类型')
    }
    if (!(options.success == undefined || typeof options.success === 'function')) {
      throw new Error('success 传递一个函数类型')
    }
    if (!(options.error == undefined || typeof options.error === 'function')) {
      throw new Error('error 传递一个函数类型')
    }
  
    // 2. 设置一套默认值
    var _default = {
      url: options.url,
      type: options.type || 'GET',
      async: typeof options.async === 'boolean' ? options.async : true,
      dataType: options.dataType || 'string',
      data: options.data || '',
      success: options.success || function () {},
      error: options.error || function () {}
    }
    if (typeof _default.data === 'object') {
      var str = ''
      for (var key in _default.data) {
        str += key + '=' + _default.data[key] + '&'
      }
      _default.data = str.slice(0, -1)
    }
  
    // 3. 发送请求
    var xhr = creXhr()
    if (_default.type.toUpperCase() === 'GET' && _default.data) {
      _default.url += '?' + _default.data
    }
    xhr.open(_default.type, _default.url, _default.async)
    xhr.onreadystatechange = function () {
      if (xhr.status >= 200 && xhr.status < 300 && xhr.readyState === 4) {
        if (_default.dataType === 'json') {
          var res = JSON.parse(xhr.responseText)
          _default.success(res)
        } else if (_default.dataType === 'string') {
          _default.success(xhr.responseText)
        }
      }
      if (xhr.readyState === 4 && xhr.status >= 400) {
        _default.error(xhr.status)
      }
    }
    if (_default.type.toUpperCase() === 'POST') {
      xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
    }
    xhr.send(_default.data)
  }

  
  export default ajax