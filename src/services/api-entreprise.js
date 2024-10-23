export async function searchEnterprise(filters) {

  console.log('filters=', filters);

  const nameFilter = filters.name;
  const departmentFilter = filters.department;
  const associationTypeFilter = filters.type === 'association';

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
      return processApiResponse(filters, data);
      /*const results = data.results;
      console.log(results);
      let tmp = [];
      results.forEach(e => {
        const code = filters.type === 'association' ? e.complements?.identifiant_association : e.siege?.siret;

        let address_line1 = e.siege?.adresse;
        let address_line2 = e.siege?.code_postal + ' ' + e.siege?.libelle_commune;
        address_line1 = address_line1.replace(address_line2, '');

        const isClosed = e.date_fermeture != null;
        const nom = e.nom_raison_sociale;

        if (code !== null && nom !== null && !(isClosed && ignoreClosedFilter)) {
          tmp.push({
            type: 'principal',
            code,
            nom: e.nom_raison_sociale,
            nom_extra: 'Etablissement principal',

            date_fermeture: e.date_fermeture,

            est_association: e.complements?.est_association,
            est_entrepreneur_individuel: e.complements?.est_entrepreneur_individuel,

            adresse_ligne1: address_line1,
            adresse_ligne2: address_line2,
          })

          if (e.matching_etablissements) {
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
                  code: code2,
                  nom, // reprise du nom du parent car les établissements secondaires n'ont pas de nom propre
                  nom_extra: nom_extra ?? 'Etablissement secondaire',

                  date_fermeture: e2.date_fermeture,

                  adresse_ligne1: address_line1,
                  adresse_ligne2: address_line2,
                });
              }
            });
          }
        }
      });
      return tmp;*/
    })
}

export function processApiResponse(filters, json) {
  const ignoreClosedFilter = filters.ignoreClosed;

  const results = json.results;
  console.log(results);
  let tmp = [];
  results.forEach(e => {
    const code = filters.type === 'association' ? e.complements?.identifiant_association : e.siege?.siret;

    let address_line1 = e.siege?.adresse;
    let address_line2 = e.siege?.code_postal + ' ' + e.siege?.libelle_commune;
    address_line1 = address_line1.replace(address_line2, '');

    const isClosed = e.date_fermeture != null;
    const nom = e.nom_raison_sociale;

    if (code !== null && nom !== null && !(isClosed && ignoreClosedFilter)) {
      tmp.push({
        type: 'principal',
        code,
        nom: e.nom_raison_sociale,
        nom_extra: 'Etablissement principal',

        date_fermeture: e.date_fermeture,

        est_association: e.complements?.est_association,
        est_entrepreneur_individuel: e.complements?.est_entrepreneur_individuel,

        adresse_ligne1: address_line1,
        adresse_ligne2: address_line2,
      })

      if (e.matching_etablissements) {
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
              code: code2,
              nom, // reprise du nom du parent car les établissements secondaires n'ont pas de nom propre
              nom_extra: nom_extra ?? 'Etablissement secondaire',

              date_fermeture: e2.date_fermeture,

              adresse_ligne1: address_line1,
              adresse_ligne2: address_line2,
            });
          }
        });
      }
    }
  });
  return tmp;
}
