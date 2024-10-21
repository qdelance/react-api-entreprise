import {useEffect, useState} from 'react'
import './App.css'
import Enterprise from './components/Enterprise'
import SearchForm from './components/SearchForm';

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
      searchEnterprise(filters);
    } else {
      console.log('No filters, no action');
    }

  }, [filters]);

  async function searchEnterprise(filters) {

    console.log('filters=', filters);

    const nameFilter = filters.name;
    const departmentFilter = filters.department;
    const associationTypeFilter = filters.type === 'association';
    const ignoreClosedFilter = filters.ignoreClosed;

    const baseURL = 'https://recherche-entreprises.api.gouv.fr/search';
    let searchParams = new URLSearchParams();
    searchParams.set('q', nameFilter);
    searchParams.set('departement', departmentFilter);
    searchParams.set('est_association', associationTypeFilter);

    searchParams.set('minimal', 'true');
    searchParams.set('include', 'siege,complements,matching_etablissements');
    searchParams.set('per_page', '25');
    searchParams.set('limite_matching_etablissements', '20');
    searchParams.set('etat_administratif', 'A');

    const URL = baseURL + '?' + searchParams.toString();

    console.log(URL);

    return fetch(URL)
      .then(data => data.json())
      .then(data => {
        const results = data.results;
        console.log(results);
        let tmp = [];
        results.forEach(e => {
          const code = filters.type === 'association' ? e.complements?.identifiant_association : e.siege?.siret;

          let address_line1 = e.siege?.adresse;
          let address_line2 = e.siege?.code_postal + ' ' + e.siege?.libelle_commune;
          address_line1 = address_line1.replace(address_line2, '');

          const isClosed = e.date_fermeture != null;
          if (code != null && !(isClosed && ignoreClosedFilter)) {
            tmp.push({
              type: 'principal',
              nom_extra: 'Etablissement principal',

              nom: e.nom_complet,
              date_fermeture: e.date_fermeture,

              est_association: e.complements?.est_association,
              est_entrepreneur_individuel: e.complements?.est_entrepreneur_individuel,

              code,

              adresse_ligne1: address_line1,
              adresse_ligne2: address_line2,
            })

            if (e.matching_etablissements) {
              // Les établissements secondaires n'ont pas de nom
              // On reprend celui de l'établissement principal
              const nom_parent = e.nom_complet;

              e.matching_etablissements.forEach(e2 => {
                // Certains établissements secondaires ont une sorte de complément de nom
                // On tente de lire la première ligne l'ajouter en complément du nom
                const nom_extra = e2.liste_enseignes?.[0];

                const code2 = filters.type === 'association' ? e2.identifiant_association : e2.siret;

                const isClosed2 = e2.date_fermeture != null || e2.ancien_siege === true;

                // Parfois, on reçoit dans les établissements secondaires le même que le principal...
                const duplicated = e2.est_siege === true;

                let address_line1 = e2.adresse;
                let address_line2 = e2.code_postal + ' ' + e2.libelle_commune;
                address_line1 = address_line1.replace(address_line2, '');

                // On pense qu'il n'y a jamais de code association dans les établissemnts secondaires,
                // mais on tente au cas où...
                if (code2 != null && !duplicated && !(isClosed2 && ignoreClosedFilter)) {
                  tmp.push({
                    type: 'secondaire',
                    nom_extra: nom_extra ?? 'Etablissement secondaire',

                    code: code2,
                    nom: nom_parent,
                    date_fermeture: e2.date_fermeture,

                    adresse_ligne1: address_line1,
                    adresse_ligne2: address_line2,
                  });
                }
              });
            }
          }
        });
        setEnterprises(tmp);
      })
  }

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
