import Ming from './Ming'
import Ship from './Ship'

export default class Game {
	constructor() {
		// Setup a menu
		this.menu = document.getElementById('menu')
		document.getElementById('newGame').addEventListener('click', this.start)

		// Create the game pieces
		this.ming = new Ming(this)
		this.ship = new Ship(this.ming)
	}

	showMenu = () => {
		this.menu.classList.remove('hidden')
	}

	hideMenu = () => {
		this.menu.classList.add('hidden')
	}

	start = () => {
		this.hideMenu()
		this.ming.reset()
	}
}
