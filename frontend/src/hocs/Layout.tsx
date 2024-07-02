import Head from 'next/head';

// Own files.
import Navbar from '@/components/Navbar';

type LayoutProps = {
    title: string;
    content: string;
    children: React.ReactNode;
};

const Layout:  React.FunctionComponent<LayoutProps> = (props) => {
    const { title, content, children } = props;

    return (
      <div>
        <Head>
            <title>{title}</title>
            <meta name='description' content={content} />
        </Head>
        <Navbar />
        <div className='container'>
            {children}
        </div>
      </div>
    )
  }

  Layout.defaultProps = {
    title: 'Navbar title',
    content: 'Content for navbar'
  }
  
  export default Layout;