/**
 * Created by zhangjing on 2017/10/20.
 */
import  React from 'react'
import {StyleSheet,View,Image,Text} from 'react-native'
import theme from '../../../constants/theme';
import px2dp from '../../../utils/px2dp'
function ImageView({imgUrl,labelTime}) {
    return(
        <View style={styles.container}>
            <Image source={{uri: imgUrl}} style={styles.img}/>
            <View style={styles.dateLabel}>
                <Text style={styles.label}>{labelTime}</Text>
            </View>
        </View>
    );
}

const styles=StyleSheet.create({
    dateLabel:{
        backgroundColor: 'rgba(0,0,0,.5)',
        position: 'relative',
        width: theme.screenWidth,
        height: px2dp(50),
        bottom: px2dp(50),
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    label:{
        color: '#fff',
        fontSize: px2dp(20),
        marginRight: px2dp(20),
        fontWeight: 'bold'
    },
    img:{
        width:theme.screenWidth,
        height:px2dp(400),
        resizeMode:'cover'
    }
});
export default ImageView