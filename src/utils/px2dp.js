/**
 * Created by zhangjing on 2017/10/19.
 */
import {Dimensions} from 'react-native';

const deviceHeightDp=Dimensions.get('window').height;

const uiHeightPx = 592;

export default function px2dp(uiElementPx) {
    //console.log(deviceWidthDp);
    //console.log(deviceHeightDp);
    return uiElementPx *  deviceHeightDp / uiHeightPx;
}