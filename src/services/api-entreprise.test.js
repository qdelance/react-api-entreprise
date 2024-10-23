import {expect, test} from 'vitest'
import circulereJSON from './testData/circulere.json'
import toulouseJSON from './testData/toulouse-metropole.json'
import vicatJSON from './testData/vicat.json'
import emmausJSON from './testData/emmaus.json'
import {processApiResponse} from "./api-entreprise.js";

test('circulere', () => {
  const filters = {
    name: 'Circulere',
    type: 'entreprise',
    departement: '38',
    ignoreClosed: true,
  }
  const entreprises = processApiResponse(filters, circulereJSON);
  expect(entreprises.length).toBe(1);
  expect(entreprises.filter(e => e.type === 'principal').length).toBe(1);
  expect(entreprises.filter(e => e.type === 'secondaire').length).toBe(0);
  expect(entreprises.length).toBe(1);
})

test('toulouse metropole', () => {
  const filters = {
    name: 'toulouse metropole',
    type: 'entreprise',
    departement: '31',
    ignoreClosed: true,
  }
  const entreprises = processApiResponse(filters, toulouseJSON);
  // expect(entreprises.length).toBe(44);
  expect(entreprises.filter(e => e.type === 'principal').length).toBe(25);
  expect(entreprises.filter(e => e.type === 'secondaire').length).toBe(19);
  expect(entreprises[0].nom).toBe('TOULOUSE METROPOLE');
})

test('vicat', () => {
  const filters = {
    name: 'vicat',
    type: 'entreprise',
    departement: '73',
    ignoreClosed: true,
  }
  const entreprises = processApiResponse(filters, vicatJSON);
  // expect(entreprises.length).toBe(49);
  expect(entreprises.filter(e => e.type === 'principal').length).toBe(14);
  expect(entreprises.filter(e => e.type === 'secondaire').length).toBe(35);
  expect(entreprises[0].nom).toBe('VICAT');
})

test('emmaus', () => {
  const filters = {
    name: 'emmaus',
    type: 'association',
    departement: '73',
    ignoreClosed: true,
  }
  const entreprises = processApiResponse(filters, emmausJSON);
  expect(entreprises.length).toBe(4);
  expect(entreprises.filter(e => e.type === 'principal').length).toBe(4);
  expect(entreprises.filter(e => e.type === 'secondaire').length).toBe(0);
  expect(entreprises[0].nom).toBe('EMMAUS COMMUNAUTE');
})