import React, { useState, useEffect } from 'react';
import { FlatList, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Searchbar } from 'react-native-paper';
import { FilterModal, LawyerCard, Loading, NoDataFound } from '../components';
import theme from '../constants/theme';
import getUsersBySearch from '../hooks/getUsersBySearch';
import getUsersPageLimit from '../hooks/getUsersPageLimit';
import { FontAwesome } from '@expo/vector-icons';

export default function Home(props) {
    const [page, setPage] = useState(1);
    const [isSearch, setIsSearch] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [searchType, setsearchType] = useState('fullName');
    const [query, setquery] = useState('');
    const [searchPage, setsearchPage] = useState(1);

    const { USERS_PAGE_LOADING, USERS_PAGE_ERROR, USERS_PAGE_USERS, USERS_PAGE_PAGES, USERS_PAGE_TOTAL, USER_PAGE_HAS_MORE } =
        getUsersPageLimit(null, 'lawyer', 1, page, '20');
    const { USERS_SEARCH_LOADING, USERS_SEARCH_ERROR, USERS_SEARCH_USERS, USERS_SEARCH_PAGES, USERS_SEARCH_TOTAL, USERS_SEARCH_HAS_MORE } =
        getUsersBySearch(null, 'lawyer', 1, searchType, query, searchPage, '20');

    function handleLoadMore() {
        if (USER_PAGE_HAS_MORE) {
            setTimeout(() => {
                setPage(page + 1);
            }, 500);
        }
    }

    // Refresh Pull Down
    const [refreshing, setrefreshing] = useState(false);
    const _refresh = () => {
        setrefreshing(true);
        setPage(1);
        setTimeout(() => {
            setrefreshing(false);
        }, 500);
    };

    useEffect(() => {
        setsearchPage(1);
        setsearchPage(1);
    }, [query]);
    function handleSearchLoadMore() {
        if (USERS_SEARCH_HAS_MORE) {
            setTimeout(() => {
                setPage(page + 1)
            }, 500);
        }
    }

    function renderItem({ item }) {
        return (
            <View style={{ padding: 5, width: '100%' }}>
                <LawyerCard item={item} navigation={props.navigation} />
            </View>
        )
    }

    function handleSearch(val) {
        setsearchPage(1);
        setquery(val);
        if (val === '')
            setIsSearch(false);
        else
            setIsSearch(true)
    }

    return (
        <View style={{ flex: 1, padding: theme.SIZES.BASE }}>
            {showModal && (
                <FilterModal
                    visible={showModal}
                    value={searchType}
                    onHide={() => setShowModal(false)}
                    setField={(val) => { setShowModal(false), setsearchType(val) }}
                />
            )}
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', backgroundColor: 'white' }}>
                <Searchbar
                    style={{ flex: 1 }}
                    placeholder={'Search here'}
                    onChangeText={handleSearch}
                    // onSubmitEditing={handleSearch}
                    value={query}
                    placeholderTextColor={theme.COLORS.PRIMARY}
                    inputStyle={{ fontSize: 14, color: theme.COLORS.PRIMARY }}
                    // onIconPress={handleSearch}
                    iconColor={theme.COLORS.PRIMARY}
                />
                <FontAwesome name="sliders" size={30}
                    onPress={() => setShowModal(true)}
                    style={{ marginHorizontal: 10, alignSelf: 'center' }}
                    color={theme.COLORS.PRIMARY} />
            </View>
            {!isSearch ?
                USERS_PAGE_USERS && USERS_PAGE_USERS.length > 0 ?
                    <FlatList
                        data={USERS_PAGE_USERS}
                        renderItem={renderItem}
                        keyExtractor={item => item._id}
                        ListFooterComponent={() => {
                            return (
                                USERS_PAGE_LOADING &&
                                <Loading />
                            );
                        }}
                        onEndReached={handleLoadMore}
                        onEndThreshold={0}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={_refresh} />}
                    />
                    :
                    USERS_PAGE_LOADING ?
                        <Loading />
                        :
                        <NoDataFound />
                :
                USERS_SEARCH_USERS && USERS_SEARCH_USERS.length > 0 ?
                    <FlatList
                        data={USERS_SEARCH_USERS}
                        renderItem={renderItem}
                        keyExtractor={item => item._id}
                        numColumns={2}
                        initialNumToRender={3}
                        ListFooterComponent={() => {
                            return (
                                USERS_SEARCH_LOADING &&
                                <Loading />
                            );
                        }}
                        onEndReached={handleSearchLoadMore}
                        onEndThreshold={0}
                    />
                    :
                    USERS_SEARCH_LOADING ?
                        <Loading />
                        :
                        <NoDataFound />
            }
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.COLORS.WHITE,
        padding: theme.SIZES.BASE * 2
    }
})

