/**
 * Created by zhangjing on 2017/10/20.
 */
import {get,post,requestHtml} from '../../utils/request'
import urls from '../../constants/urls'
export function randomData(params) {
    const randomCategory = ['Android/10','iOS/10','前端/10','休息视频/10','拓展资源/10','App/10','瞎推荐/10'];
    const {pagenum}=params
    return get(urls.random+randomCategory[Math.floor(Math.random()*7)])
}