/**
 * Created by zhangjing on 2017/10/19.
 */
import * as service from './service'
export default {
    namespace:'find',
    state:{
        error:true,
        results:[],
        isLoading:false,
        loadingmore:false,
        isRenderFooter:true,
        thumbnailColor: 'rgb(130,130,130)',
    },
    effects:{
        *initData({payload = {}},{put,call}){
            // const {pagenum}=payload
            yield put({type:'loading',payload:true})
            const {data, err} = yield call(service.randomData, payload);
            yield put({type:'loading',payload:false})
            if (err)return console.log("++++++++"+JSON.stringify(err))
            yield put({type:'loadSuccess',payload:data})
            },
        *moreData({payload = {}},{put,call}){
            yield put({type:'loadingmore',payload:true})
            const {data, err} = yield call(service.randomData, payload);
            yield put({type:'loadingmore',payload:false})
            if (err)return console.log("++++++++"+JSON.stringify(err))
            yield put({type:'moreSuccess',payload:data})
            }
    },
    reducers:{
        loading(state, { payload:loading }){
            return {...state,isLoading:loading}
        },
        loadSuccess(state, { payload:data }){
            const {error,results}=data;
            return{...state,results,error}
        },
        loadingmore(state,{payload:loadingmore}){
            return {...state,loadingmore:loadingmore}
        },
        moreSuccess(state,{payload:data}){
            const {error,results}=data;
            return{...state,results:state.results.concat(results),error}
        }
    }
}