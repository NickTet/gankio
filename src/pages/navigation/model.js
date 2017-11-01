/**
 * Created by zhangjing on 2017/10/20.
 */
import Colors from '../../constants/colors'
import { AsyncStorage } from 'react-native'
export default {
    namespace:'navigation',
    state:{
        mainThemeColor:Colors.lightBlue,
        rowItemBackgroundColor:Colors.white,
        tabIconColor:Colors.lightBlue,
        pageBackgroundColor:Colors.white,
        titleColor: '#000',
        subTitleColor:'#aaa',
        segmentColor: '#ccc',
        webViewToolbarColor: 'rgba(40,40,40,.9)'
    },
    effects:{
        *init({payload = {}},{call,put})
        {
            const setting= yield AsyncStorage.getItem("setting");
            if (setting){
                const color=JSON.parse(setting)
                yield put({type:'colorInit',payload:color})
            }
            }
    },
    reducers:{
        colorInit(state, { payload:color }){
            return{...state,...color}
        }
    }
}