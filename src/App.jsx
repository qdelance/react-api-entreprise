import {useEffect, useState} from 'react'
import './App.css'
import Enterprise from './components/Enterprise'
import SearchForm from './components/SearchForm';
import {searchEnterprise} from "./services/api-entreprise.js";

function App() {

  function handleFilterChange(filters) {
    console.log('New filters received from children');
    setFilters(filters);
  }

  const [filters, setFilters] = useState({});
  const [enterprises, setEnterprises] = useState([]);

  useEffect(() => {
    if (Object.keys(filters).length !== 0) {
      console.log('Let\'s search!');

      // Call async fn from use hook
      // https://medium.com/@deniswachira_/how-to-asynchronously-call-apis-inside-the-useeffect-hook-ce524431ce6
      searchEnterprise(filters)
        .then(enterprisesList => {
          setEnterprises(enterprisesList);
        });
    } else {
      console.log('No filters, no action');
    }
  }, [filters]);



  const nbTotal = enterprises.length;
  const nbPrincipal = enterprises.filter(e => e.type === 'principal').length;
  const nbSecondaire = enterprises.filter(e => e.type === 'secondaire').length;

  return (
    <>
      <SearchForm onFilterChange={handleFilterChange}/>
      {enterprises.length === 0 && <p>Aucun résultat</p>}
      <p>{nbTotal} résultats dont {nbPrincipal} établissements principaux et {nbSecondaire} secondaires</p>
      {enterprises.map((enterprise) => <Enterprise key={enterprise.code} {...enterprise} />)}
    </>
  )
}

export default App
