//index.js
/**
 * @author Mr.Hao
 * @github https://github.com/hsw409328
 * @date 2016-10-09
 * @desc 首页路线查询方法
 */
//获取应用实例
var utils = require( '../../utils/util.js' )
var app = getApp()
var that
var city = ''
var startAds = ''
var endAds = ''
Page( {
  data: {
    ads_start: '请点击输入起点',
    ads_end: '请点击输入终点',
    ads_location: '',
    ads_rs: '',
    ads_location_name: '',
    rs:[]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo( {
      url: '../logs/logs'
    })
  },
  bindblurKey: function( e ) {
    switch( e.currentTarget.id ) {
      case 'startId':
        startAds = e.detail.value
        break
      case 'endId':
        endAds = e.detail.value
        break
      default:
        break
    }
    //收起键盘
    wx.hideKeyboard()
  },
  findAds: function( event ) {
    var getRsUrl = 'http://api.map.baidu.com/direction/v1?origin=' + startAds + '&destination=' + endAds + '&mode=transit&region=' + city + '&origin_region' + city + '&destination_region' + city + '&output=json&ak=422ebb878de3dbdea9a248045d2620dc'
    wx.request( {
      url: getRsUrl,
      data: {},
      success: function( rs ) {
        var _tmpRs = []
        var _html = ''
        if(typeof(rs.data.result.routes)!=='undefined'){
          var d = rs.data.result.routes;
          for(var o in d){
            var _cd = d[o].scheme[0].steps
            _html = ""+(parseInt(o)+1)+'、 '
            for(var t in _cd){
              _html += _cd[t][0].stepInstruction+"\n\r"
            }
            _tmpRs[o] = utils.stripTags(_html,"\"")
          }
          that.setData({ads_rs:'结果如下：'})
          that.setData({rs:_tmpRs})
        }else{
          that.setData({ads_rs:'未查询到结果'})
        }
      },
      fail: function( rs ) {

      }
    })

  },
  callbackLocation: function( rs ) {
    this.setData( { ads_location: "\n\r坐标："+rs.latitude + ' ' + rs.longitude })
    wx.request( {
      url: 'http://api.map.baidu.com/geocoder/v2/?output=json&ak=422ebb878de3dbdea9a248045d2620dc&location=' + rs.latitude + ',' + rs.longitude,
      data: {},
      success: function( rs ) {
        console.log( rs )
        that.setData( { ads_location_name: rs.data.result.addressComponent.city })
        city = rs.data.result.addressComponent.city
      },
      fail: function( rs ) {

      }
    })
  },
  onLoad: function() {
    that = this
    utils.getLoc( this.callbackLocation )
  }

})
