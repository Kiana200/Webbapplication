
//Own files.
import Layout from '@/hocs/Layout';

const HomePage = () => {
  return (
    <Layout
    title={'Home'}
    content={'Content information'}
    >
      <div className='p-5 bg-light rounded-3'>
        <div className='container-fluid py-3'>
          <h1 className='display-5 fw-bold'>Home Page</h1>
          <div className='fs-4 mt-3'>
            Welcome to the study planner site
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default HomePage;
