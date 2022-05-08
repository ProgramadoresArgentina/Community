import { Text } from '@ui-kitten/components';
import React from 'react'
import { Dimensions, Linking, View } from "react-native"
import AutoHeightImage from 'react-native-auto-height-image'
import Autolink from 'react-native-autolink';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { themeColor } from 'react-native-rapi-ui';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../../../../store';
import { navigate } from '../../../navigation/RootNavigation';
import { AxiosService } from '../../../services/axiosService';


const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.93);

const CarouselCards = ({ setPinnedPosts, state }) => {
    const [index, setIndex] = React.useState(0);
    const isCarousel = React.useRef(null);

    React.useEffect(() => {
        getPinnedList();
    }, []);

    const getPinnedList = () => {
        AxiosService().get('/pin').then(({ data }) => {
            setPinnedPosts(data);
        }).catch((error) => {
            console.log(error);
        });
    }

    const renderPreview = (url) => {
        return (
          <Text size="sm" style={{ color: themeColor.primary }} onPress={() => Linking.openURL(url)}>
            {url.toLowerCase()}
          </Text>
        )
      }


    const renderItem = ({ item, index }) => {
        const description = item.description.replace(/&#x2F;/g, '/');
        return (
            <TouchableOpacity onPress={() => navigate('PostDetail', item)}>
                {
                    item.photo ?
                    <AutoHeightImage
                        key={index}
                        width={ITEM_WIDTH}
                        maxHeight={200}
                        source={{ uri: item.photo.replace(/&#x2F;/g, '/') }}
                        style={{ borderRadius: 20 }}
                    />
                    :
                    <View style={{width: ITEM_WIDTH, height: 200, backgroundColor: 'white',
                    padding: 10, borderRadius: 10}}>
                        {
                        description !== '' &&
                        <View>
                            <TouchableOpacity>
                            <Autolink
                                component={Text}
                                renderText={(text) => <Text size="sm">{text}</Text>}
                                renderLink={(text, match) => renderPreview(match.getAnchorHref())}
                                text={description.substring(0, 250)} truncate={0}
                            />
                            </TouchableOpacity>
                        </View>
                        }
                    </View>
                }
            </TouchableOpacity>
        )
    }

    if (!state.pinnedPosts || (state.pinnedPosts.length === 0)) return null;
    return (
        <View style={{ marginBottom: 0 }}>
            <Carousel
                layout="tinder"
                layoutCardOffset={9}
                ref={isCarousel}
                data={state.pinnedPosts}
                renderItem={renderItem}
                sliderWidth={SLIDER_WIDTH}
                itemWidth={ITEM_WIDTH}
                onSnapToItem={(index) => setIndex(index)}
                useScrollView={true}
            />
            <Pagination
                dotsLength={state.pinnedPosts.length}
                activeDotIndex={index}
                carouselRef={isCarousel}
                dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginHorizontal: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.92)'
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
                tappableDots={true}
            />
        </View>

    )
}



function mapDispatchToProps(dispatch) {
    return {
        setPinnedPosts: bindActionCreators(actionCreators.setPinnedPosts, dispatch),
    }
}


function mapStateToProps(state) {
    return { state }
}
export default connect(mapStateToProps, mapDispatchToProps)(CarouselCards);
