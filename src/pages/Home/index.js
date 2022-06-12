import Bar from "@/components/Bar";

function Home() {

  return (
    <div>
      <Bar
        title='框架'
        xData={['react', 'vue']}
        yData={[30, 40]}
        style={{width:'500px',height: '400px'}}
      ></Bar>
    </div>
  )
}

export default Home
