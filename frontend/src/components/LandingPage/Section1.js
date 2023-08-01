import img from '../../images/sec1.png'
import '../../css/LandingPage/Section1.css'
function Section1(){
  return (
    <div className="section1Container">
      <div className="section1-left">
        <h1>The people platform—Where interests become friendships</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      </div>
      <img src={img} alt="oopsie daisie I lost my photograph hahahaha very few will ever see this but if you do the government is lying to you, nothing is true, everything is permitted."/>
    </div>
  )
}

export default Section1;
