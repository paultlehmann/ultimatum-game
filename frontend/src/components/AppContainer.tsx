import TopHeader from './TopHeader';

const AppContainer = (props: any) => {
  const { children, setUser, userName } = props;

  return (
    <>
      <TopHeader setUser={setUser} userName={userName} />
      <div
        style={{
          height: '85vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
          // display: 'flex',
          // flexDirection: 'column',
          // justifyContent: 'center'
        }}
      >
        {children}
      </div>
    </>
  );
};

export default AppContainer;
