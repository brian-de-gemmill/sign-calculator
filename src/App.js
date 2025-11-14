
import { useState } from 'react';
import './App.css';
import stopSign from './images/r1-1.png';

function App() {

let laborRate = 0.8
let designRate = 1.08
let cuttingCharge = 0.0034
let inkCharge = 0.01055
let hiItensityPrismatic = [0.011323, 'HIP White']
let britelineNonReflective = [0.003402, 'Black']

let ecFilm = 0.010197

const [price, setPrice] = useState(0)
const [sellPrice, setSellPrice] = useState(0)
const [width, setWidth] = useState(0)
const [height, setHeight] = useState(0)
const [signType, setSignType] = useState('digitalPrint')
const [signMaterial, setSignMaterial] = useState('aluminum080')
const [cutting, setCutting] = useState(true)
const [protectiveFilm, setProtectiveFilm] = useState(false)
const [singledSided, setSingledSided] = useState(true)
const [drillForHoles, setDrillForHoles] = useState(true)
const [roundCorners, setRoundCorners] = useState(true)
const [backgroundColor, setBackgroundColor] = useState(hiItensityPrismatic)
const [legendColor, setLegendColor] = useState(hiItensityPrismatic)
const [designTime, setDesignTime] = useState(0)
const [laborTime, setLaborTime] = useState(0)  




let calculateSize = (width, height) => {
  let area = width * height;
  return area;
}

let calculateLabor = (laborRate, designRate, laborTime, designTime) => {
  let laborTotal = laborRate * laborTime
  let designTotal = designRate * designTime
  let totalLabor = laborTotal + designTotal
  return totalLabor
}

let calculateVinylCost = (backgroundColor, legendColor) => {

  let backgroundColorCost = backgroundColor[0] * 100
  let legendColorCost = legendColor[0] * 100
  return (backgroundColorCost + legendColorCost) / 100
}


let calculateMaterialCost = (signType, signMaterial, cutting, protectiveFilm, singledSided ) => {
  let size = calculateSize(width, height)
  let signMaterialCost = 0
  let signTypeCost = 0
  let totalMaterialCost = 0

  switch (signMaterial) {
    case "aluminum080":
      signMaterialCost = 0.033605 * size
      break
    case "maxMetal":
      signMaterialCost = 0.012752 * size
      break
    case "coroplast":
      signMaterialCost = 0.010547 * size
      break
    case "aluminum125":
      signMaterialCost = 0.052626 * size
      break
    case "none" :
      signMaterialCost = 0.000001 * size
      break
    default:
      signMaterialCost = 0.033605 * size
      break
  }



  switch (signType) {
    case "digitalPrint":
      signTypeCost = (inkCharge * size) + (backgroundColor[0] * size)
      break
    case "vinylPrint":
      signTypeCost = calculateVinylCost(backgroundColor, legendColor) * size
      break
    default:
      signTypeCost = (inkCharge * size) + (backgroundColor * size)
  }
  


  if (!singledSided) {
    signTypeCost *= 2
  }

  totalMaterialCost = signMaterialCost + signTypeCost
  
  if (cutting) {
    totalMaterialCost += cuttingCharge * size
    
  }
 
  if (protectiveFilm) {
    totalMaterialCost += ecFilm * size
  }

  return totalMaterialCost * 1.05
}

let calculateTotalCost = () => {
  let materialCost = calculateMaterialCost(signType, signMaterial, cutting, protectiveFilm, singledSided)
  let laborCost = calculateLabor(laborRate, designRate, laborTime, designTime)
  let finalCost = materialCost + laborCost
  setPrice(Math.round(finalCost))
  setSellPrice(Math.round(finalCost / 0.65))
}

let handleBackgroundColorChange = (material) => {
  let color = material.split(',')
  setBackgroundColor([color[0],color[1]])
}

let handleLegendColorChange = (material) => {
  let color = material.split(',')
  setLegendColor([color[0],color[1]])
}



  return (
    <div className="App bg-zinc-200 pt-8 max-w-7xl flex flex-col place-self-center">
      <p className='mb-6'>Paragraph text across the top explaining the current item</p>
      <div className='flex flex-row items-start p-2 w-full'>

        <div className='flex flex-col items-start p-2 w-1/2 '>
          <div className="flex flex-row w-full">
            <div className='flex flex-row items-start p-2 mb-4'>
              <label className='flex flex-row w-1/2'>
                Sign Width (inches) : <input onChange={(e) => setWidth(e.target.value)} className='flex ml-2 mr-2 bg-neutral-50 rounded-md pl-2 w-1/4' type="number" name="widthInput" placeholder='0'/>
              </label>
              <label className='flex flex-row w-1/2'>
                Sign Height (inches) : <input onChange={(e) => setHeight(e.target.value)} className='flex ml-2 mr-2 bg-neutral-50 rounded-md pl-2 w-1/4' type="number" name="heightInput" placeholder='0'/>
              </label>
            </div>
          </div>

          <label className='p-2 mb-2'> Sign Type:
            <select onChange={(e) => setSignType(e.target.value)} className='ml-2  bg-neutral-50 rounded-md' name="signType" id="signTypes">
              <option value="digitalPrint">Digital Print - This automatically adds ink use charge</option>
              <option value="vinylPrint">Vinyl Print - This will add Hi Intensity Pristmatic</option>
            </select>
          </label>
          <div className='flex flex-row w-full '>
            <label className='ml-2 w-1/2 flex flex-row items-start'> Select Material:
              <select onChange={(e) => setSignMaterial(e.target.value)} className='ml-2  bg-neutral-50 rounded-md' name="signMaterial" id="signMaterials">
                <option value="aluminum080">Aluminum .080</option>
                <option value="maxMetal">MaxMetal</option>
                <option value="coroplast">Coroplast</option>
                <option value="aluminum125">Aluminum .125</option>
                <option value="none">None</option>
              </select>
            </label>
            <div className="flex flex-col w-1/2">
              <div className="flex flex-col ml-2">
                <div className="flex flex-row items-center justify-start">
                  <input onChange={(e) => setCutting(e.target.checked)} type="checkbox" name="addCuttingCharge" id="addCuttingCharges" defaultChecked={true} />
                  <p className='ml-2 self-start'>Add cutting charge</p>
                </div>
                <p className="text-stone-400">Odd shapes or {`>`} 48" will be ordered.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-row items-start mb-2 mt-2 w-full">

            <div className="flex flex-col mb-4 items-start w-1/2">
              <div className="flex flex-col">
                <p>Select background color: </p>
                <select onChange={(e) => handleBackgroundColorChange(e.target.value)} className='ml-2  bg-neutral-50' name="backgroundColor" id="backgroundColors">
                  <option value={[hiItensityPrismatic[0], 'HIP White']}>High Intensity White</option>
                  <option value={[hiItensityPrismatic[0], 'HIP Green']}>High Intensity Green</option>
                  <option value={[hiItensityPrismatic[0], 'HIP Orange']}>High Intensity Orange</option>
                  <option value={[hiItensityPrismatic[0], 'HIP Red']}>High Intensity Red</option>
                </select>
              </div>
              
              <div className="flex flex-col mt-4">
                <p>Select legend Color:</p>
                <select onChange={(e) => handleLegendColorChange(e.target.value)} className='ml-2  bg-neutral-50' name="fontColor" id="fontColors">
                  <option value={[hiItensityPrismatic[0], 'HIP White']}>High Intensity White</option>
                  <option value={[hiItensityPrismatic[0], 'HIP Green']}>High Intensity Green</option>
                  <option value={[hiItensityPrismatic[0], 'HIP Orange']}>High Intensity Orange</option>
                  <option value={[hiItensityPrismatic[0], 'HIP Blue']}>High Intensity Blue</option>
                  <option value={[hiItensityPrismatic[0], 'HIP Red']}>High Intensity Red</option>
                  <option value={[britelineNonReflective[0], 'Black']}>Briteline Non Reflective</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col w-1/2">
              <div className='flex flex-col items-start'>
                <div className='flex flex-row items-center'>
                  <input onChange={(e) => setProtectiveFilm(e.target.checked)} className='ml-2' type="checkbox" name="addProtectiveFilm" id="addProtectiveFilms" defaultChecked={false}/>
                  <p className='ml-2'>Add protective film</p>
                </div>
                <p className='text-stone-400'>Film will extend the life of signs by 3-5 years</p>
              </div>
              <label className='flex flex-row items-center mt-2' >
                <input className='mr-2' type="checkbox" name="directionalArrow" id="directionalArrow" />
                Directional Arrow
                <select className='bg-neutral-50 pl-1 ml-2'>
                  <option value="">Up</option>
                  <option value="">Up and Right</option>
                  <option value="">Right</option>
                  <option value="">Down and Right</option>
                  <option value="">Down</option>
                  <option value="">Down and Left</option>
                  <option value="">Left</option>
                  <option value="">Up and Left</option>
                  <option value="">Left and Right</option>
                </select>
              </label>
              
            </div>

          </div>

          <div className="flex flex-row w-full">
            <div className="flex flex-col w-1/2 items-start">
              <div className='flex flex-row items-center self-start'>
                <input onChange={(e) => setRoundCorners(e.target.checked)} type="checkbox" name="roundCorner" id="roundCorners" defaultChecked={true} />
                <p className='ml-2'>Rounded Corners</p>
              </div>
              <div className='flex flex-col items-start text-stone-400'>
              
                <p>Standard radius will be as follows:</p>
                <p>1-10"   - 1/4" Radius</p>
                <p>10-29"  - 1/2" Radius</p> 
                <p>30-35"  - 3/4" Radius</p> 
                <p>35-48"  - 1" Radius</p>
                
              </div>
            </div>
            <div className="flex flex-col w-1/2 items-start">
              <div className='flex flex-row items-center self-start'>
                <input onChange={(e) => setDrillForHoles(e.target.checked)} type="checkbox" name="drillForHole" id="drillForHoles" defaultChecked={true} />
                <p className='ml-2'>Drill for Holes</p>
              </div>
              <div className='flex flex-col items-start text-stone-400'>
                <p>Standard Hole Drilling will be as follows:</p>
                <p>1-10"   - 1" from Top/Bottom</p>
                <p>10-29"  - 1.5" from Top/Bottom</p> 
                <p>30-35"  - 3" from Top.Bottom</p> 
                <p>35-48"  - No holes</p>
              </div>
            </div>
          </div>

          <div className="flex flex-row w-full p-2 mt-4 mb-4">
            <div className="flex flex-col w-1/2">
              <div className="flex flex-row justify-start items-center">
                <label>
                  <input className='mr-2' type="radio" name="sideSelector" id="singleSide" defaultChecked={true} onClick={() => setSingledSided(true)} />
                  Singled Sided
                </label>
              </div>
              <p className="text-stone-400 ml-4 text-start">Finished on one side only</p>
            </div>
            <div className="flex flex-col w-1/2">
              <div className="flex flex-row justify-start items-center">
                <label>
                  <input className='mr-2' type="radio" name="sideSelector" id="doubleSide" onClick={() => setSingledSided(false)}/>
                  Double Sided
                </label>
              </div>
              <p className="text-stone-400 ml-4 text-start">Finished on both sides</p>
              <p className="text-stone-400 ml-4 text-start">Will not be drilled for holes</p>
            </div>
          </div>

          <div className="flex flex-row w-full p-2 mb-4">
            <div className="flex flex-col w-1/2 justify-start p-4">
              <p className='text-start'>Design Time (minutes)</p>
              <input onChange={(e) => setDesignTime(e.target.value)} type="number" name='designTime' className="bg-neutral-50 rounded-md" />
              <p className="text-stone-400">Remove Design time and reprice if doing multiple of the same sign.</p>
            </div>
            <div className="flex flex-col w-1/2 p-4">
              <p className='text-start'>Labor Time (minutes)</p>
              <input onChange={(e) => setLaborTime(e.target.value)} type="number" name='laborTime' className="bg-neutral-50 rounded-md" />
            </div>
          </div>

          <div className="flex flex-row w-full justify-around">
            <button className='bg-stone-700 text-white rounded-lg p-1 mt-2' onClick={() => calculateTotalCost()}>Update Price</button>
            <div className="flex flex-col bg-neutral-50 w-1/4 rounded-xl">
              <p className='text-2xl font-bold'>${price}</p>
              <p>D.E.G Cost</p>
            </div>
            <div className="flex flex-col bg-neutral-50 w-1/4 rounded-xl">
              <p className='text-2xl font-bold'>${sellPrice}</p>
              <p>D.E.G.Sell Price</p>
            </div>
          </div>

        </div>

        <div className='flex flex-col w-1/2 items-center'>
          <div className="flex flex-row">
            <p>Quick Sign Select: </p>
            <select className='ml-2 bg-zinc-50' name="quickSignSelect" id="quickSignSelects">
              <option value="r1-1">R1-1</option>
              <option value="r1-2">R1-2</option>
              <option value="r1-3">R1-3</option>
              <option value="r1-3">Custom</option>
            </select>
          </div>
          <p>Custom Sign</p>
          <div className="flex flex-col p-6">
            <img src={stopSign} alt="A stop sign" />
            <div className="flex flex-col justify-around">
              <div className="flex flex-row items-center">
                <button className="bg-stone-700 text-white p-2 mt-2 rounded-lg">24x24</button>
                <p className='ml-2'>For Alleys or restrictive physical conditions</p>
              </div>
              <div className="flex flex-row items-center">
                <button className="bg-stone-700 text-white p-2 mt-2 rounded-lg">30x30</button>
                <p className='ml-2'>Single Lane Conventional Highways</p>
              </div>
              <div className="flex flex-row items-center">
                <button className="bg-stone-700 text-white p-2 mt-2 rounded-lg">36x36</button>
                <p className='ml-2'>Multilane Convential Highways</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start">
            <p className="font-bold text-xl">Ordering Info</p>
            <p>{width} x {height} {signMaterial}  </p>
            <p>Custom Sign</p>
            <p>{signType === 'digitalPrint' ? 'Digital Print' : "Vinyl Print"} {singledSided ? "Single sided" : "Double Sided"}</p>
            <p>Background: {backgroundColor[1]}, Legend: {legendColor[1]} </p>
            <p>{roundCorners ? 'Radius Corners' : 'No radius corners'}, {drillForHoles ? 'Drilled for holes' : 'No hole drilling'} </p>

          </div>
        </div>



      </div>
    </div>
  );
}

export default App;
