import React, { useEffect, useState } from 'react'
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { Alert, Text, View } from 'react-native'
import RazorpayButton from '@app/modules/payment/Razorpay'
import { User } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardScreenNavigationProp } from '@app/types/navigationTypes';
import Logout from '@app/components/ui/Logout';
import { getPaymentDetails } from '@app/redux/slices/dashboardSlice';
import { RootState } from '@app/redux/store';

const checkThisMonthUserSubscription = (sub_pay_date: string): boolean => {
    const current_date = new Date();
    const user_date = new Date(sub_pay_date);
    const month =  (current_date.getMonth() + 1 ) - (user_date.getMonth() + 1);
    return month !== 0;
}

const findPreviousNotTakeSubscriptionAmount = (sub_pay_date: string, subscription_id: number) => {
    const current_date = new Date();
    const user_date = new Date(sub_pay_date);
    const month = ((current_date.getMonth() + 1) - (user_date.getMonth() + 1));

    switch (subscription_id) {
        case 1: return month * 1000
        case 2: return month * 3000
        case 3: return month * 5000;
        default: return 0
    }
}

const CustomDrawer = (props: any) => {
    const [isUserSubscribedThisMonth, setIsUserSubscribedThisMonth] = useState(true);
    const [subscriptionAmount, setSubscriptionAmount] = React.useState(0);
    const user = useSelector((state: RootState) => state.user.user);
    const dispatch = useDispatch();
    const bucket_details = useSelector((state: RootState) => state.dashboard_slice.payment_details.bucket_details);
    const navigation = useNavigation<DashboardScreenNavigationProp>();

    const paymentSuccess = () => {
        Alert.alert("Payment success", "Subscription added sucessfully.")
        dispatch(getPaymentDetails());
    }

    const paymentFailed = (errMessage: string) => {
        Alert.alert(
            "Payment failed",
            errMessage.replace('_', ' ')
        );
    }


    const handleNavigation = (screenName: string) => {
        // @ts-ignore
        navigation.navigate(screenName);
        props.navigation.closeDrawer();
    }

    // find total subscription amount
    useEffect(() => {
        if (bucket_details) {
            const amount = findPreviousNotTakeSubscriptionAmount(
                bucket_details?.sub_pay_date,
                bucket_details?.subscription_id
            );
            setSubscriptionAmount(amount);
        }
    }, [bucket_details,new Date().getMonth()]);

    // check user subscribed this month or not 
    useEffect(() => {
        if (bucket_details) {
            const isPaidMonth = checkThisMonthUserSubscription(bucket_details?.sub_pay_date);
            if (isPaidMonth) setIsUserSubscribedThisMonth(false);
            else setIsUserSubscribedThisMonth(true);
        }
    }, [new Date().getMonth(), bucket_details])

    return (
        <View className="p-2 w-full h-full flex-col bg-white dark:bg-app-dark-theme-0 items-center justify-between relative" {...props}>
            <View>
                <View className="w-full flex-row items-center justify-center p-2 h-24 rounded-2xl bg-[#F8F8F8] dark:bg-[#222222]">
                    <View className={`w-11 h-11 flex items-center justify-center overflow-hidden relative bg-white rounded-full border-2 border-gray-200`}>
                        <View className={"absolute top-2"}>
                            <User color={"#000"} fill={"#121212"} size={40} />
                        </View>
                    </View>
                    <View className={`flex-col ml-2 justify-center flex-1 h-full`}>
                        <Text numberOfLines={1} className='text-sm uppercase font-poppins-semibold text-[#121826] dark:text-gray-200'>{user?.first_name + " " + user?.last_name}</Text>
                        <Text className="text-sm font-poppins-medium text-[#9B9B9B] dark:text-gray-400">{user?.mobile}</Text>
                    </View>
                </View>
                <View className="mt-2">
                        <DrawerItemList androidPressColor={"#fff"} {...props} />
                        <DrawerItem labelStyle={{
                            color: "#575757"
                        }} label={"About us"} onPress={() => handleNavigation("AboutusScreen")} />
                        <DrawerItem labelStyle={{
                            color: "#575757"
                        }} label={"Privacy Policy"} onPress={() => handleNavigation("PrivacyPolicyScreen")} />
                        <Logout pressColor='red' style={'px-5 mt-5 font-sm font-medium font-poppins-medium text-[#575757]'} />
                </View>
            </View>
            <View className="w-full">
                {
                    !isUserSubscribedThisMonth ? (
                        <RazorpayButton
                            buttonTitle={"Renew Subscription"}
                            subscription_amount={subscriptionAmount}
                            success_cb={paymentSuccess}
                            failure_cb={paymentFailed}
                        />
                    ) : ("")
                }
            </View>
        </View>
    )
}

export default CustomDrawer