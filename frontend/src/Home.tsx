import React, { SyntheticEvent, useEffect, useState } from 'react';
import { allFoodsList } from './Services';
import { ToastContainer, toast } from 'react-toastify';
import { IFoods, ResultFoods } from './models/IFoods';
import FoodsItem from './components/FoodsItem';
import { Card, Dropdown, DropdownProps, Form, Grid, Input, Label, Pagination, PaginationProps, Select } from 'semantic-ui-react';
import { categories } from './Datas';
import SiteMenu from './components/SiteMenu';

export default function Home() {


  const [foodsArr, setFoodsArr] = useState<ResultFoods[]>([]);
  const [searchArr, setSearchArr] = useState<ResultFoods[]>([]);

  // select category
  const [selectCategory, setSelectCategory] = useState(0)
  const [searchData, setSearchData] = useState("")

  // pages
  const [totalPages, settotalPages] = useState(0);
  const foodsPerPage= 8
  const [currentPage, setCurrentPage] = useState<number>(1);
  const lastFood = currentPage * foodsPerPage;
  const firstFood = lastFood - foodsPerPage;
  const currentFoods = foodsArr.slice(firstFood, lastFood);

  useEffect(() => {

    toast.loading("Yükleniyor.")
    allFoodsList().then(res => {
      const dt: IFoods = res.data;
      setFoodsArr(dt.result!)
      setSearchArr(dt.result!)
      settotalPages(Math.ceil(dt.result!.length / foodsPerPage));
      toast.dismiss();
    }).catch(err => {
      toast.dismiss();
      toast.error("" + err)
    })


  }, []);



  const search = ( q:string ) => {
    setCurrentPage(1)
    setSearchData(q)
    var newArr: ResultFoods[] = searchArr
    if ( q === "" ) {
      if ( selectCategory !== 0 ) {
        newArr = newArr.filter( item => item.cid === selectCategory )
      }

      setFoodsArr(newArr)

      settotalPages(Math.ceil(newArr.length / foodsPerPage));


    }else {
      q = q.toLowerCase()
      var newArr = searchArr.filter( item => item.name?.toLowerCase().includes(q) || (""+item.glycemicindex).includes(q) )
      
      if ( selectCategory !== 0 ) {
        newArr = newArr.filter( item => item.cid === selectCategory )
      }

      setFoodsArr(newArr)

      settotalPages(Math.ceil(newArr.length / foodsPerPage));
    }
  }



    // select cat
    const catOnChange = ( str: string ) => {
      const numCat = parseInt(str)
      setSelectCategory( numCat )
      setCurrentPage(1)
  
      console.log( numCat )
  
      var newArr: ResultFoods[] = searchArr
      if ( numCat !== 0 ) {
        newArr = newArr.filter( item => item.cid === numCat )
      }
      
      if ( searchData !== "" ) {
        newArr = newArr.filter( item => item.name?.toLowerCase().includes(searchData) || (""+item.glycemicindex).includes(searchData) )
      }
      setFoodsArr(newArr)
  
      console.log( newArr )
  
      settotalPages(Math.ceil(newArr.length / foodsPerPage));
  
    }


  return (
    <>
      <ToastContainer />
      <SiteMenu />

      <Grid columns='2'>
        <Grid.Row>

          <Grid.Column width='8'>
            <Grid>
              <Grid.Row >
                <Grid.Column width='14'>
                  <Input onChange={(e) => search(e.target.value)} fluid icon='search' placeholder='Arama...' />
                </Grid.Column>
                <Grid.Column width='2'>
                  <Label color='grey' style={{ display: 'flex', justifyContent: 'center', fontSize: 16 }} >
                    {foodsArr.length}
                  </Label>
                </Grid.Column>

              </Grid.Row>
            </Grid>
          </Grid.Column>


          <Grid.Column width='8'>
            <Select onChange={(e, data) => catOnChange("" + data.value)} fluid placeholder='Kategori Seç' options={categories} />
          </Grid.Column>

        </Grid.Row>
      </Grid>

      <Grid >
        {currentFoods.map((item, index) =>
          <FoodsItem key={index} item={item} />
        )}

      </Grid>

      <Grid>
        <Pagination
          activePage={currentPage} 
          pointing
          secondary
          totalPages={totalPages}
          onPageChange={(e: SyntheticEvent, { activePage }: PaginationProps) => setCurrentPage(parseInt("" + activePage!))}
        />
      </Grid>
    </>
  );
}
