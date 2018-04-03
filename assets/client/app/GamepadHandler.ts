class GamepadHandler {
	private gamePads: Gamepad[];
	private start: number;

	public loop() {
		this.gamePads = navigator.getGamepads();
		const gamePad: Gamepad = this.gamePads[0];

		if (this.buttonPressed(gamePad.buttons[0])) {
			console.log('yey my dude');
		}

		this.start = window.requestAnimationFrame(this.loop.bind(this));
	}

	private buttonPressed(button: GamepadButton): boolean {
		return button.pressed;
	}
}