import Section1 from "./Section1"
import Section2 from "./Section2";
import Section3 from "./Section3";
import '../../css/LandingPage/index.css';

function LandingPage(){
  return (
    <div className="landingPageContainer">
        <Section1 />
        <Section2 />
        <Section3 />
    </div>
  )
}

export default LandingPage;
