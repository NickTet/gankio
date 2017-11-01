/**
 * Created by zhangjing on 2017/10/20.
 */
import {get,post,requestHtml} from '../../utils/request'
import * as dateUtil from '../../utils/getDate'
import {AsyncStorage} from 'react-native';
import urls from '../../constants/urls'
const HOME_DATA = '@HomeData';
export function homeData(params) {
    const {date}=params
    return get(urls.daily+date)
}

export function savaLocalData(json,time){
    let data = {
        time: time,
        content: json
    };
    try {
        AsyncStorage.setItem(HOME_DATA, JSON.stringify(data));
    } catch (error) {
        //
    }
}

export function fetchLocalData(time) {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem(HOME_DATA, (error, result)=>{
            if(!error){
                const data = JSON.parse(result);
                //judge whether the data is updated
                if(data) {
                    if (data.time.toString() === time) {
                        resolve(data.content);
                    } else {
                        reject(data.content);
                    }
                }else{ //no any data records
                    reject(null);
                }
            }else{ // must fetch server data
                reject(null);
            }
        });
    }).then(data=>({data}))
        .catch(err=>({err}));
}