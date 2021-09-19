import React, { useState } from "react";
import { View } from "react-native";
import { Picker, Text, themeColor } from "react-native-rapi-ui";
import { Button } from '@ui-kitten/components';


// Redux
import { connect } from 'react-redux';
import { actionCreators } from "../../../store";
import { bindActionCreators } from "redux";
import { navigateReset } from "../../navigation/RootNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosService } from "../../services/axiosService";

DetailsComponent = ({ state, setUser }) => {
    const [roles, setRoles] = React.useState([]);
    const [editing, setEditing] = React.useState(false);

    if (!state.user) return null;

    React.useEffect(() => {
        getRoles();
    }, []);

    const getRoles = () => {
        AxiosService().get('/role').then(({data}) => {
            data = data.map(e => ({label: e.roleName, value: e.roleName}));
            setRoles(data);
        }).catch((error) => {
          console.log(error);
        });
    }

    const changeRole = (roleName) => {
        const body = {
            roleName: roleName
        }
        AxiosService().post('/role/change', body).then(({data}) => {
            state.user.role = data.role;
            setUser(state.user)
        }).catch((error) => {
          console.log(error);
        }).then(_ => setEditing(false));
    }


    const logout = async () => {
        await AsyncStorage.removeItem('@auth');
        navigateReset('Login');
      }

    return (
        <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 }}>
                <Text size="sm">Email</Text>
                <Text size="sm" fontWeight="light">{state.user.email}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8, alignItems: 'center' }}>
                <Text size="sm">Rol</Text>
                {
                    editing ?
                        <Picker
                            items={roles}
                            value={state.user.role.roleName}
                            labelSize="sm"
                            placeholderSize="sm"
                            borderWidth={0}
                            iconColor={themeColor.primary}
                            // labelColor={themeColor.primary}
                            placeholder="Choose your role"
                            onValueChange={(val) => changeRole(val)}
                        />
                    :
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text size="sm" fontWeight="light">{state.user.role.roleName}</Text>
                        <Button
                            size="tiny"
                            onPress={() => setEditing(true)}
                            appearance='ghost'
                            status='info'>
                            Cambiar
                        </Button>
                    </View>
                        
                }
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 }}>
                <Text size="sm">Contraseña</Text>
                <Button
                    size="tiny"
                    // onPress={() => logout()}
                    appearance='ghost'
                    status='basic'>
                    Cambiar contraseña
                </Button>
            </View>

            <View style={{ width: '100%', alignItems: 'center' }}>
                <>
                    <View style={{ width: '50%', marginVertical: 40 }}>
                        <Button
                            size="tiny"
                            onPress={() => logout()}
                            appearance='outline'
                            status='basic'>
                            Cerrar sesión
                        </Button>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text size="sm">Necesitas ayuda?</Text>
                        <Button
                            size="tiny"
                            // onPress={() => logout()}
                            appearance='ghost'
                            status='info'>
                            Contactar a los administradores
                        </Button>
                    </View>
                </>
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
export default connect(mapStateToProps, mapDispatchToProps)(DetailsComponent);