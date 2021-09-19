import React, { useState } from "react";
import { View, Clipboard } from "react-native";
import { Text } from "react-native-rapi-ui";
import { Button, Divider } from '@ui-kitten/components';


// Redux
import { connect } from 'react-redux';
import { actionCreators } from "../../../store";
import { bindActionCreators } from "redux";
import { AxiosService } from "../../services/axiosService";
import Toast from "react-native-toast-message";

InvitesComponent = ({ state }) => {
  const [invitesList, setInvitesList] = useState([]);

  if (!state.user) return null;

  React.useEffect(() => {
    getInvitesList();
  }, []);

  const getInvitesList = async () => {
    AxiosService().get('/invitation/list').then(({data}) => {
        setInvitesList(data);
    }).catch((err) => console.log(err))
  }

  const copyText = (text) => {
    Clipboard.setString(text);
    Toast.show({
        text1: 'Copiado',
        position: 'bottom'
    })
  }

  return (
    <View>
        {
            invitesList.map((invite, i) => (
                <View key={i}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 }}>
                        <Text size="sm">Invitación {i+1}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                            <Text size="sm" fontWeight="light"
                            style={{textDecorationLine: invite.used ? 'line-through' : 'none'}}>
                                {invite.invitation}
                            </Text>
                            <Button size="tiny" style={{marginLeft: 10}}
                            appearance="ghost" onPress={() => copyText(invite.invitation)}>Copiar</Button>
                        </View>
                    </View>
                    <Divider></Divider>
                </View>
            ))
        }

        <View style={{alignItems: 'center'}}>
            <Button appearance="ghost" onPress={()=> getInvitesList()}
            size="tiny" status="basic">Refrescar lista</Button>
        </View>
    </View>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    setUser: bindActionCreators(actionCreators.setUser, dispatch),
  }
}
function mapStateToProps(state) {
  return { state }
}
export default connect(mapStateToProps, mapDispatchToProps)(InvitesComponent);