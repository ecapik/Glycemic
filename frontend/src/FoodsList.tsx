import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { Grid, Header, Segment, Transition } from 'semantic-ui-react'
import FoodsItem from './components/FoodsItem'
import SiteMenu from './components/SiteMenu'
import { IFoods, ResultFoods } from './models/IFoods'
import { userFoodList } from './Services'
import { autControl } from './Util'

export default function FoodsList() {

  const navigate = useNavigate()
  const [foodsArr, setFoodsArr] = useState<ResultFoods[]>([]);
    
  // animation
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if( autControl() === null ) {
      localStorage.removeItem("user")
      localStorage.removeItem("aut")
      navigate("/")
    }
    setTimeout(() => {
      setVisible(true)
    }, 500);

    // user food list service
    toast.loading("Yükleniyor.")
    userFoodList().then( res => {
        const dt:IFoods = res.data;
        setFoodsArr( dt.result! )
        toast.dismiss(); 
    }).catch(err => {
        toast.dismiss();
        toast.error( "Ürün listeleme işlemi sırasında bir hata oluştu!" )
    })

  }, [])

  return (
    <>
        <ToastContainer />
        <SiteMenu />
        <Header as='h3' block>
        Eklediğiniz Gıdalar
        </Header>
        <Transition visible={visible} animation='slide down' duration={750}>
        <Segment vertical color='grey'  >
            Eklediğiniz gıdaların listesini ve durumlarını burada bulabilirsiniz.
        </Segment>
        </Transition>

        <Grid >
            { foodsArr.map((item, index) => 
                <FoodsItem  key={index} item={item} status={true} /> 
            )}
        </Grid>
    </>
  )
}