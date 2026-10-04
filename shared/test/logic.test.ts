import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateAwardPoints,
  calculateScanPoints,
  canScanAgain,
  getFideliteNiveau,
  parseCarnetToken,
  generateCarnetToken,
} from '../src/logic/fidelite.js';
import {
  expandPlagesToHourSlots,
  getCreneauPlacesRestantes,
  getNextStatus,
  isCreneauBookable,
  normalizeRelaisSettings,
  slotFromId,
} from '../src/logic/relais.js';
import { isUpcomingEvent } from '../src/logic/agenda.js';
import { formatDistanceMeters, haversineMeters } from '../src/logic/geo.js';
import { matchesSearchQuery } from '../src/logic/search.js';
import {
  ActeurLocalCategory,
  FideliteNiveau,
  FideliteRegleMode,
  LocalRelaisRetraitStatus,
  RelaisCreneauType,
} from '../src/types/enums.js';
import type { ActeurLocal, CarteFideliteScan, RelaisCreneau } from '../src/types/models.js';

const acteur = { id: 'a1', categorie: ActeurLocalCategory.RestaurationMenus } as ActeurLocal;
const scan = (commerceId: string, ageMs: number) =>
  ({ commerceId, date: new Date(Date.now() - ageMs).toISOString(), pointsGagnes: 8 }) as CarteFideliteScan;

test('fidélité : premier passage = points de base + bonus', () => {
  assert.deepEqual(calculateScanPoints(acteur, []), { base: 8, firstScanBonus: 5, total: 13 });
});

test('fidélité : pas de points deux fois en 24 h chez le même commerce', () => {
  const recent = [scan('a1', 60_000)];
  assert.equal(calculateScanPoints(acteur, recent).total, 0);
  assert.equal(canScanAgain('a1', recent), false);
  assert.equal(canScanAgain('autre', recent), true);
});

test('fidélité : retour après 24 h sans bonus de premier passage', () => {
  assert.deepEqual(calculateScanPoints(acteur, [scan('a1', 25 * 3600_000)]), { base: 8, firstScanBonus: 0, total: 8 });
});

test('fidélité : niveaux et règles de points', () => {
  assert.equal(getFideliteNiveau(49), FideliteNiveau.Bronze);
  assert.equal(getFideliteNiveau(50), FideliteNiveau.Argent);
  assert.equal(getFideliteNiveau(100), FideliteNiveau.Or);
  assert.equal(calculateAwardPoints({ mode: FideliteRegleMode.ChiffreAffaires, valeur: 1 }, 12.4), 12);
  assert.equal(calculateAwardPoints({ mode: FideliteRegleMode.ChiffreAffaires, valeur: 1 }, 0), 0);
  assert.equal(calculateAwardPoints({ mode: FideliteRegleMode.Forfait, valeur: 20 }), 20);
});

test('fidélité : le jeton de carnet se relit', () => {
  const token = generateCarnetToken('device-abc123');
  assert.equal(parseCarnetToken(token), 'DEVICE-ABC123');
  assert.equal(parseCarnetToken(' qr-carnet-device-abc123 '), 'DEVICE-ABC123');
  assert.equal(parseCarnetToken('ab'), null);
});

test('relais : plages découpées en créneaux d’une heure', () => {
  const slots = expandPlagesToHourSlots([{ heureDebut: '10:00', heureFin: '12:30' }]);
  assert.deepEqual(slots.map((s) => s.heureDebut), ['10:00', '11:00']);
});

test('relais : réglages invalides remplacés par des valeurs sûres', () => {
  const settings = normalizeRelaisSettings({ openingDays: [9, 1, 1], defaultCapacite: 500 } as never);
  assert.deepEqual(settings.openingDays, [1]);
  assert.equal(settings.defaultCapacite, 30);
  assert.ok(settings.plages.length > 0);
});

test('relais : créneau complet ou bloqué non réservable', () => {
  const settings = normalizeRelaisSettings({ openingDays: [0, 1, 2, 3, 4, 5, 6], plages: [{ heureDebut: '10:00', heureFin: '11:00' }] });
  const creneau: RelaisCreneau = {
    id: 'c', date: '2026-10-05', heureDebut: '10:00', heureFin: '11:00',
    type: RelaisCreneauType.Depot, capacite: 2, reserves: 1, blocked: false,
  };
  assert.equal(getCreneauPlacesRestantes(creneau), 1);
  assert.equal(isCreneauBookable(creneau, settings), true);
  assert.equal(isCreneauBookable({ ...creneau, reserves: 2 }, settings), false);
  assert.equal(isCreneauBookable({ ...creneau, blocked: true }, settings), false);
  assert.equal(isCreneauBookable({ ...creneau, heureDebut: '15:00' }, settings), false);
});

test('relais : identifiant de créneau relu et statuts enchaînés', () => {
  const slot = slotFromId('creneau-2026-10-05-23:00-Retrait');
  assert.equal(slot?.heureFin, '00:00');
  assert.equal(slot?.type, RelaisCreneauType.Retrait);
  assert.equal(slotFromId('n-importe-quoi'), null);
  assert.equal(getNextStatus(LocalRelaisRetraitStatus.EnAttente), LocalRelaisRetraitStatus.DisponibleAuLocal);
  assert.equal(getNextStatus(LocalRelaisRetraitStatus.Recupere), null);
});

test('agenda : un événement en cours reste à venir', () => {
  const now = Date.parse('2026-10-05T12:00:00Z');
  assert.equal(isUpcomingEvent({ dateFin: '2026-10-05T13:00:00Z' }, now), true);
  assert.equal(isUpcomingEvent({ dateFin: '2026-10-05T11:00:00Z' }, now), false);
});

test('distance : affichage et arrondi à 1 km', () => {
  assert.equal(formatDistanceMeters(250), '250 m');
  assert.equal(formatDistanceMeters(999.6), '1,0 km');
  assert.equal(formatDistanceMeters(1540), '1,5 km');
  assert.equal(formatDistanceMeters(1540, 'en'), '1.5 km');
  assert.equal(formatDistanceMeters(-1), '');
  const d = haversineMeters({ latitude: 44.85, longitude: -0.57 }, { latitude: 44.86, longitude: -0.57 });
  assert.ok(d > 1100 && d < 1120);
});

test('recherche : insensible aux accents et à la casse', () => {
  assert.equal(matchesSearchQuery('Café des Chartrons', 'cafe'), true);
  assert.equal(matchesSearchQuery('Boulangerie', 'fromagerie'), false);
});
