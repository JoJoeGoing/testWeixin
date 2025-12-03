
import request from './request'
export function getTouriseList(){
    return request({
        url:'/popularScience/app/getIntelligentVoiceList?pageNum=1&pageSize=9999',
        method:'get'
    })
}