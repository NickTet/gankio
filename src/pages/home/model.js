/**
 * Created by zhangjing on 2017/10/19.
 */
import * as dateUtil from '../../utils/getDate'
import * as service from './service'
import Toast from 'react-native-root-toast';
export default {
    namespace:'home',
    state:{
        loading:false,
        results:{},
        error:true,
        category:[]
    },
    effects:{
        *init({payload = {}},{put,call}){
            const {date}=payload;
            yield put({type:'loading',payload:true})
            const {data, err} = yield call(service.homeData, payload);
            yield put({type:'loading',payload:false})
            if (err)return console.log(err);
            if (Object.keys(data.results).length!=0){
                yield call(service.savaLocalData,JSON.stringify(data),date)
                yield put({type:'initSuccess',payload:data})
            }else {
                let toast=Toast.show('今日干货尚未更新', {
                    position: 65,
                    backgroundColor: '#8bd480'
                });
                setTimeout(() => {Toast.hide(toast)}, 3000);
                let {data,err} = yield call(service.fetchLocalData, dateUtil.getYesterdayFromDate(date));
                if (err){
                    //    第一次还没有任何缓存的时候
                    const {data, err} = yield call(service.homeData, {date:dateUtil.getYesterdayFromDate(date)});
                    if (err)return console.log(err);
                    yield put({type:'initSuccess',payload:data})
                }else {
                    yield put({type:'initSuccess',payload:JSON.parse(data)})
                }
            }
            }
    },
    reducers:{
        loading(state, { payload:loading }){
            return{...state,loading:loading}
        },
        initSuccess(state,{payload:data}){
            const {results,error,category}=data
            return{...state,results,error,category}
        }
    }
}