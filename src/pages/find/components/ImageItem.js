/**
 * Created by zhangjing on 2017/10/24.
 */
import React from 'react'
import {StyleSheet,View,Text,Image} from 'react-native'
import Avatar from '../../../pages/home/components/Avatar'
function ImageItem({iconname,title}) {
    return(
        <View style={styles.container}>
            <Avatar icon={iconname}/>
            <Text></Text>
        </View>
    )
}

const styles=StyleSheet.create({
    container:{
        flex:1,
    },
    title:{

    }
});