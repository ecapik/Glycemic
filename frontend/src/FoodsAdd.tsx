import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'
import { Form, Header, InputOnChangeData, Segment, Transition } from 'semantic-ui-react'
import SiteMenu from './components/SiteMenu'
import { categories } from './Datas';
import { IFoods } from './models/IFoods';
import { foodRegister } from './Services';
import { autControl } from './Util';

export default function FoodsAdd() {

  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()
  // form item states
  const [name, setName] = useState("")
  const [glycemicindex, setGlycemicindex] = useState(0)
  const [source, setSource] = useState("")
  const [cid, setCid] = useState('0')
  const [base64Image, setBase64Image] = useState("")

  const fncSend = () => {
    console.log('fncSend Call')
  }

  // image to base64
  const imageOnChange = (e: any, d: InputOnChangeData) => {
    const file = e.target.files[0]
    const size: number = file.size / 1024 // kb
    if (size > 10) { // 10 kb
      toast.error("Lütfen max 10 kb bir resim seçiniz!")
    } else {
      getBase64(file).then(res => {
        console.log('res', res)
        setBase64Image("" + res)
      })
    }
  }

  useEffect(() => {
    if( autControl() === null ) {
      localStorage.removeItem("user")
      localStorage.removeItem("aut")
      navigate("/")
    }
    setTimeout(() => {
      setVisible(true)
    }, 500);
  }, [])

  const getBase64 = (file: any) => {
    return new Promise(resolve => {
      let fileInfo;
      let baseURL: any = "";
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        baseURL = reader.result
        resolve(baseURL);
      };
      console.log(fileInfo);
    });
  }

  // food add fnc
  const register = (e: React.FormEvent) => {
    if (name == '' && source == '' && base64Image == '') {
      toast.warning('Eksik alanları doldurunuz!');
    } else if (name =="") {
      toast.warning('Ürün adını giriniz');
    } else if (source == '') {
      toast.warning('Kaynak giriniz');
    }else if (cid == "") {
      toast.warning('Ürünün kategorisini giriniz');
    } else if (base64Image == '') {
      toast.warning('Ürünün resmini giriniz');
    }else {
            e.preventDefault()
            toast.loading("Yükleniyor")
            foodRegister(cid, name, glycemicindex, base64Image, source).then(res => {
              const fod: IFoods = res.data
              if (fod.status) {
                toast.info("Kayıt Başarılı")
              } else {
                toast.dismiss();
                toast.error(fod.message)
              }
            }).catch(() => {
              toast.dismiss();
              toast.error("Kayıt sırasında hata oluştur")
            })
          }
  }

  return (
    <>
      <ToastContainer />
      <SiteMenu />
      <Header as='h3' block>
        Gıda Ekle
      </Header>
      <Transition visible={visible} animation='slide down' duration={750}>
        <Segment vertical color='grey'  >
          Burada eklediğiniz gıdalar, admin onayına gidip denetimden geçtikten sonra yayına alınır.
        </Segment>
      </Transition>

      <Form>
        <Form.Group widths='equal'>
          <Form.Input  onChange={(e, d) => setName(d.value)} fluid label='Adı' placeholder='Adı' />
          <Form.Input   onChange={(e) => setGlycemicindex(parseInt(e.target.value))} type='number' min='0' max='150' fluid label='Glisemik İndex' placeholder='Glisemik İndex' />
          <Form.Select label='Kategori' value={cid} fluid placeholder='Kategori' options={categories} search onChange={(e, d) => setCid("" + d.value)} />
        </Form.Group>

        <Form.Group widths='equal'>
          <Form.Input onChange={(e, d) => imageOnChange(e, d)} type='file' fluid label='Resim' placeholder='Resim' />
          <Form.Input onChange={(e, d) => setSource(d.value)} fluid label='Kaynak' placeholder='Kaynak' />
        </Form.Group>

        <Form.Button onClick={(e) => register(e)}>Submit</Form.Button>
      </Form>

    </>
  )
}