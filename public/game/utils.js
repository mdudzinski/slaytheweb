// A collection of utility functions.
// None are allowed to modify the game state!

// Returns a random-looking string for ids.
export function uuid(a) {
	return a
		? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
		: ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid)
}

// Returns a new, shuffled version of an array.
// See https://bost.ocks.org/mike/shuffle/
export function shuffle(array) {
	// Make a copy
	array = array.slice()
	var m = array.length
	var t
	var i

	// While there remain elements to shuffle…
	while (m) {
		// Pick a remaining element…
		i = Math.floor(Math.random() * m--)

		// And swap it with the current element.
		t = array[m]
		array[m] = array[i]
		array[i] = t
	}

	return array
}

// Returns a range of numbers. Example: range(3) === [1,2,3] or range(3, 6) === [6,7,8]
export function range(size, startAt = 0) {
	return [...Array(size).keys()].map((i) => i + startAt)
}

// Get a random number within a range
export function random(from, to) {
	const r = range(to - from, from)
	return shuffle(r)[0]
}

// Returns the current room in a dungeon.
export function getCurrRoom(state) {
	return state.dungeon.rooms[state.dungeon.index || 0]
}

// Returns an array of targets (player or monsters) in the current room.
// The "target" argument must be either "player", "enemyx" (where x is the index) or "all enemies"
export function getTargets(state, target) {
	if (target.startsWith('player')) {
		return [state.player]
	}
	const room = getCurrRoom(state)
	if (target.startsWith('enemy')) {
		const index = target.split('enemy')[1]
		const monster = room.monsters[index]
		if (!monster) {
			throw new Error(`could not find "${target}" in room ${state.dungeon.index}`)
		}
		return [monster]
	}
	if (target === 'all enemies') {
		return room.monsters
	}
	throw new Error(`Can not find monster with target: "${target}"`)
}

export function cardHasValidTarget(cardTarget, target) {
	return (
		(cardTarget === 'player' && target.includes('player')) ||
		(cardTarget === 'enemy' && target.includes('enemy')) ||
		(cardTarget === 'all enemies' && target.includes('enemy'))
	)
}

export function isRoomCompleted(room) {
	if (room.type === 'monster') {
		const deadMonsters = room.monsters.filter((m) => m.currentHealth < 1)
		return deadMonsters.length === room.monsters.length
	}

	if (room.type === 'campfire') {
		return room.choice === 'rest' || Boolean(room.reward)
	}
}

// Check if the current room in a game has been cleared.
export function isCurrentRoomCompleted(state) {
	const room = getCurrRoom(state)
	return isRoomCompleted(room)
}

// Checks if the whole dungeon (all rooms) has been cleared.
export function isDungeonCompleted(state) {
	const clearedRooms = state.dungeon.rooms.map(isRoomCompleted).filter(Boolean)
	return clearedRooms.length === state.dungeon.rooms.length
}

export function clamp(x, lower, upper) {
	return Math.max(lower, Math.min(x, upper))
}
