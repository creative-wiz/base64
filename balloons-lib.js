// balloons-lib.js

export class Balloon {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.size = 20 + Math.random() * 20;
		this.color = `hsl(${Math.random() * 360},70%,60%)`;
		this.vy = -(0.8 + Math.random() * 1.2);
		this.offset = Math.random() * 1000;
		this.mark = null; // 'smiley' or 'love'
	}

	update() {
		this.y += this.vy;
		this.x += Math.sin((Date.now() / 1000 + this.offset) * 1.2) * 0.3;
	}

	draw(ctx, time) {
		const s = this.size;
		ctx.save();
		ctx.translate(this.x, this.y);

		// balloon shape
		ctx.beginPath();
		ctx.moveTo(0, -s * 0.6);
		ctx.bezierCurveTo(-s, -s * 1.2, -s * 1.6, 0, 0, s);
		ctx.bezierCurveTo(s * 1.6, 0, s, -s * 1.2, 0, -s * 0.6);
		ctx.closePath();

		const grad = ctx.createLinearGradient(-s, -s, s, s);
		grad.addColorStop(0, "white");
		grad.addColorStop(0.2, this.color);
		grad.addColorStop(1, this.color);
		ctx.fillStyle = grad;
		ctx.fill();

		// face or love text
		if (this.mark === 'smiley') {
			ctx.fillStyle = "black";
			ctx.beginPath();
			ctx.arc(-s * 0.3, -s * 0.2, s * 0.1, 0, Math.PI * 2);
			ctx.arc(s * 0.3, -s * 0.2, s * 0.1, 0, Math.PI * 2);
			ctx.fill();

			ctx.beginPath();
			ctx.arc(0, s * 0.2, s * 0.4, 0, Math.PI, false);
			ctx.lineWidth = 2;
			ctx.strokeStyle = "black";
			ctx.stroke();
		} else if (this.mark === 'love') {
			ctx.fillStyle = "white";
			ctx.font = `${s * 0.4}px Arial`;
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText("LOVE", 0, 0);
		}

		ctx.restore();

		// balloon knot
		const knotY = this.y + s * 1.05;
		ctx.beginPath();
		ctx.moveTo(this.x - 3, this.y + s * 0.9);
		ctx.lineTo(this.x + 3, this.y + s * 0.9);
		ctx.lineTo(this.x, knotY);
		ctx.closePath();
		ctx.fillStyle = "#555";
		ctx.fill();

		// string
		ctx.beginPath();
		const stringLength = 50;
		const segments = 12;
		for (let i = 0; i <= segments; i++) {
			const ratio = i / segments;
			const wave = Math.sin((ratio * 3 + time / 600 + this.offset)) * 3;
			const px = this.x + wave;
			const py = knotY + ratio * stringLength;
			if (i === 0) ctx.moveTo(px, py);
			else ctx.lineTo(px, py);
		}
		ctx.strokeStyle = "#444";
		ctx.lineWidth = 1;
		ctx.stroke();
	}

	isTouched(x, y) {
		const dx = this.x - x;
		const dy = this.y - y;
		return Math.sqrt(dx * dx + dy * dy) < this.size;
	}
}