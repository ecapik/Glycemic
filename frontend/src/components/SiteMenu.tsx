import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Input, Menu, Button, Modal, Form, Icon, Label } from 'semantic-ui-react'
import { IUser, UserResult } from '../models/IUser';
import { logout, userAndAdminLogin, userRegister } from '../Services';
import { control, encryptData } from '../Util';

export default function SiteMenu() {


    const [user, setUser] = useState<UserResult | null>()
    const [isAdmin, setIsAdmin] = useState(false)


    // login status
    const [loginStatus, setLoginStatus] = useState(false)
    useEffect(() => {
        urlActive()
        const usr = control()
        if (usr !== null) {
            setUser(usr)
            usr.roles!.forEach(item => {
                if (item.name === "ROLE_admin") {
                    setIsAdmin(true)
                }
            });
        }
    }, [loginStatus])
    const [activeItem, setActiveItem] = useState("")


    //MODALS
    const [modalRegisterStatus, setmodalRegisterStatus] = useState(false);
    const [modalLoginStatus, setModalLoginStatus] = useState(false)
    const [isLogOut, setisLogOut] = useState(false)


    // login and register states
    const [userName, setUserName] = useState("");
    const [userSurname, setUserSurname] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [userMail, setUserMail] = useState("");
    const [userPass, setUserPass] = useState("");


    // useNavigate
    const navigate = useNavigate()
    const loc = useLocation()
    // url control and menu active
    const urlActive = () => {
        if (loc.pathname === "/") {
            setActiveItem("Anasayfa")
        }
        if (loc.pathname === "/foodsAdd") {
            setActiveItem("Gıda Ekle")
        }
        if (loc.pathname === "/foodsList") {
            setActiveItem("Eklediklerim")
        }
        if (loc.pathname === "/waitFoodsList") {
            setActiveItem("Bekleyenler")
        }
    }


    const handleItemClick = (name: string) => {
        console.log('name', name)
        setActiveItem(name)

        if (name === "Anasayfa") {
            navigate("/")
        }

        if (name === "Gıda Ekle") {
            if (control() === null) {
                setModalLoginStatus(true);
            } else {
                navigate("/foodsAdd")
            }
        }


        if (name === "Eklediklerim") {
            if (control() === null) {
                setModalLoginStatus(true);
            } else {
                navigate("/foodsList")
            }
        }

        if (name === "Bekleyenler") {
            if (control() === null) {
                setModalLoginStatus(true);
            } else {
                navigate("/waitFoodsList")
            }
        }

    }






    // login fnc
    const login = () => {
        if (userMail == '' && userPass == '') {
            toast.warning('Eksik alanları doldurunuz');
        } else if (userMail == '') {
            toast.warning('Mail giriniz')
        }
        else if (userPass == '') {
            toast.warning('Şifrenizi Giriniz')
        } else {
            toast.loading("Yükleniyor.")
            userAndAdminLogin(userMail, userPass).then(res => {
                const usr: IUser = res.data
                if (usr.status!) {
                    const userResult = usr.result!
                    const stUserResult = JSON.stringify(userResult)
                    const key = process.env.REACT_APP_SALT
                    const cryptString = encryptData(userResult, key!);
                    const userAutSTring = encryptData(res.config.headers, key!);
                    localStorage.setItem("user", cryptString)
                    localStorage.setItem("auth", userAutSTring)
                    setLoginStatus(usr.status!)
                    setModalLoginStatus(false)
                }
                toast.dismiss();
            }).catch(err => {
                toast.dismiss();
                toast.error("Bu yetkilerde bir kullanıcı yok!")
            })
        }
    }



    // register fnc
    const register = (e: React.FormEvent) => {
        if (userName == '' && userSurname == '' && userMail == '' && userPhone == '' && userPass == '') {
            toast.warning('Eksik Bilgileri Giriniz');
        }
        else if (userName == '') {
            toast.warning('İsim Giriniz');
        } else if (userSurname == '') {
            toast.warning('Soyisim Giriniz');
        } else if (userMail == '') {
            toast.warning('Mail Giriniz');
        } else if (userPhone == '') {
            toast.warning('Telefon Giriniz');
        } else if (userPass == '') {
            toast.warning('Şifre Giriniz Giriniz');
        } else {
            e.preventDefault()
            toast.loading("Yükleniyor")
            userRegister(userName, userSurname, userPhone, userMail, userPass).then(res => {
                const usr: IUser = res.data
                if (usr.status) {
                    toast.info("Kayıt Başarılı")
                    setmodalRegisterStatus(false)
                    setModalLoginStatus(true)
                    toast.dismiss();
                } else {
                    toast.dismiss();
                    toast.error(usr.message)
                }
            }).catch(err => {
                toast.dismiss();
                toast.error("Kayıt sırasında hata oluştur")
            })
        }
    }
    //logout fnc
    const fncLogOut = () => {
        //setisLogout
        //setUser(null)
        //setLoginStatus(false)

        logout().then(res => {
            toast.loading("Yükleniyor")
            localStorage.removeItem("user")
            setisLogOut(false)
            setUser(null)
            setLoginStatus(false)
            setIsAdmin(false)
            toast.dismiss();
            window.location.href = "/"
        }).catch(err => {
            toast.dismiss();
            toast.error("Çıkış İşleminde Hata Oluştu")
        })
    }



    return (
        <>

            <Menu size='small'>
                <Menu.Item
                    name='Anasayfa'
                    active={activeItem === 'Anasayfa'}
                    onClick={(e, data) => handleItemClick(data.name!)}
                />
                <Menu.Item
                    name='Gıda Ekle'
                    active={activeItem === 'Gıda Ekle'}
                    onClick={(e, data) => handleItemClick(data.name!)}
                />
                <Menu.Item
                    name='Eklediklerim'
                    active={activeItem === 'Eklediklerim'}
                    onClick={(e, data) => handleItemClick(data.name!)} />

                {isAdmin === true &&
                    <Menu.Item
                        name='Bekleyenler'
                        active={activeItem === 'Bekleyenler'}
                        onClick={(e, data) => handleItemClick(data.name!)}
                    />
                }


                <Menu.Menu position='right'>
                    {!user &&
                        <>
                            <Menu.Item>
                                <Button positive onClick={(e, data) => setmodalRegisterStatus(true)}>Kayıt Ol</Button>
                            </Menu.Item>
                            <Menu.Item>
                                <Button primary onClick={(e, data) => setModalLoginStatus(true)}>Giriş Yap</Button>
                            </Menu.Item>
                        </>}

                    {user &&
                        <>
                            <Menu.Item>
                                <Label color='red' >
                                    <Icon name='user outline' /> {user.name} {user.surname}
                                </Label>
                            </Menu.Item>
                            <Menu.Item>
                                <Button negative onClick={(e, data) => setisLogOut(true)}>Çıkış Yap</Button>
                            </Menu.Item>
                        </>}

                </Menu.Menu>
            </Menu>

            <Modal
                size='mini'
                open={modalRegisterStatus}
                onClose={() => setmodalRegisterStatus(false)}
            >
                <Modal.Header>Kayıt Ol</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Form>
                            <Form.Group widths='equal' >
                                <Form.Input value={userName} onChange={(e, d) => setUserName(d.value)} icon='user' iconPosition='left' fluid placeholder='Name' />
                            </Form.Group>

                            <Form.Group widths='equal'>
                                <Form.Input value={userSurname} onChange={(e, d) => setUserSurname(d.value)} icon='user outline' iconPosition='left' fluid placeholder='Surname' />
                            </Form.Group >

                            <Form.Group widths='equal'>
                                <Form.Input value={userPhone} onChange={(e, d) => setUserPhone(d.value)} type='tel' icon='phone square' iconPosition='left' fluid placeholder='Phone' />
                            </Form.Group >

                            <Form.Group widths='equal'>
                                <Form.Input value={userMail} onChange={(e, d) => setUserMail(d.value)} type='mail' icon='mail' iconPosition='left' fluid placeholder='Mail' />
                            </Form.Group >

                            <Form.Group widths='equal'>
                                <Form.Input value={userPass} onChange={(e, d) => setUserPass(d.value)} type='password' icon='key' iconPosition='left' fluid placeholder='Password' />
                            </Form.Group >

                            <Button ui fluid large primary submit button onClick={(e) => register(e)} >
                                Kayıt Ol
                            </Button>
                        </Form>

                    </Modal.Description>
                </Modal.Content>
            </Modal>


            <Modal
                size='mini'
                open={modalLoginStatus}
                onClose={() => setModalLoginStatus(false)}
            >
                <Modal.Header>Giriş Yap</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Form>
                            <Form.Group widths='equal' >
                                <Form.Input value={userMail} onChange={(e, d) => setUserMail(d.value)} type='mail' icon='mail' iconPosition='left' fluid placeholder='e-mail' />
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.Input value={userPass} onChange={(e, d) => setUserPass(d.value)} type='password' icon='key' iconPosition='left' fluid placeholder='password' />
                            </Form.Group >
                            <Button ui fluid large primary submit button onClick={(e) => login()} >
                                Giriş Yap
                            </Button>
                        </Form>

                    </Modal.Description>
                </Modal.Content>
            </Modal>

            <Modal
                size={'mini'}
                open={isLogOut}
                onClose={() => setisLogOut(false)}
            >
                <Modal.Header>Çıkış İşlemi</Modal.Header>
                <Modal.Content>
                    <p>Çıkmak istediğinizden emin misiniz?</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button negative onClick={() => setisLogOut(false)}>
                        İptal
                    </Button>
                    <Button positive onClick={() => fncLogOut()}>
                        Çıkış Yap
                    </Button>
                </Modal.Actions>
            </Modal>





        </>
    )
}
