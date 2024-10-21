import Badge from "./Badge.jsx";

function Enterprise({
                      type,
                      nom,
                      nom_extra,
                      code,
                      date_fermeture,
                      est_association,
                      est_entrepreneur_individuel,
                      adresse_ligne1,
                      adresse_ligne2,
                    }) {

  let debug = '';
  if (type === 'principal') {
    debug = <>
      <Badge danger={date_fermeture != null}>Fermée</Badge>&nbsp;
      <Badge danger={est_association}>Asso</Badge>&nbsp;
      <Badge danger={est_entrepreneur_individuel}>Individuel</Badge>
    </>;
  } else {
    debug = <Badge danger={date_fermeture != null}>Fermée</Badge>;
  }

  return (
    <div className={`card ${type}`}>
      <strong>{nom}</strong> {code && <small>{code}</small>}
      <p>{nom_extra}</p>
      {adresse_ligne1 && <p>{adresse_ligne1}</p>}
      {adresse_ligne2 && <p>{adresse_ligne2}</p>}
      {debug && <p>{debug}</p>}
    </div>
  )
}

export default Enterprise;
