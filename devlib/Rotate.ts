type MatrixRotate = [number, number, number, number, number, number, number, number, number];
type _MatrixRotate = MatrixRotate | Rotate;

class Rotate {
	private _rotates: MatrixRotate[] = [];

	constructor(rotates?: _MatrixRotate | _MatrixRotate[]) {
		if (rotates) {
			if (Array.isArray(rotates) && (Array.isArray(rotates[0]) || rotates[0] instanceof Rotate)) {
				this.addRotates(<_MatrixRotate[]>rotates);
			} else {
				this.addRotate(<_MatrixRotate>rotates);
			}
		}
	}

	public addRotate(matrix: _MatrixRotate) {
		if (matrix instanceof Rotate)
			return this.addRotates(matrix.get());

		if (matrix.length != 9) throw "Not 9 number";

		for (let i = 0; i < 9; i++)
			if (Math.abs(matrix[i]) > 1)
				throw "Not normal matrix";

		this._rotates.push(matrix);
	}

	public addRotates(rotates: _MatrixRotate[]) {
		for (let i = 0; i < rotates.length; i++)
			this.addRotate(rotates[i]);
	}

	public get(): MatrixRotate[] {
		return this._rotates;
	}
	public getPosition(x: number, y: number, z: number): Vector {
		for (var j = 0, l = this._rotates.length; j < l; j++) {
			let dx = x * this._rotates[j][0] + y * this._rotates[j][1] + z * this._rotates[j][2];
			let dy = x * this._rotates[j][3] + y * this._rotates[j][4] + z * this._rotates[j][5];
			let dz = x * this._rotates[j][6] + y * this._rotates[j][7] + z * this._rotates[j][8];
			x = dx;
			y = dy;
			z = dz;
		}
		return { x: x, y: y, z: z };
	}

	public static getRotate(rotates?: _MatrixRotate[], random?: Random): Rotate {
		random = Utility.getRandom(random);

		if (rotates == undefined)
			return new Rotate(Rotate.ROTATE_NONE);

		let rotate: _MatrixRotate;
		if (Array.isArray(rotates) && (Array.isArray(rotates[0]) || rotates[0] instanceof Rotate))
			rotate = rotates[random.nextInt(rotates.length)];

		return (rotate instanceof Rotate) ? rotate : new Rotate(rotate);
	}


	public static readonly ROTATE_NONE: MatrixRotate = [1, 0, 0, 0, 1, 0, 0, 0, 1];

	public static readonly ROTATE_90Y: MatrixRotate = [0, 0, -1, 0, 1, 0, 1, 0, 0];
	public static readonly ROTATE_180Y: MatrixRotate = [-1, 0, 0, 0, 1, 0, 0, 0, -1];
	public static readonly ROTATE_270Y: MatrixRotate = [0, 0, 1, 0, 1, 0, -1, 0, 0];

	public static readonly ROTATE_90X: MatrixRotate = [1, 0, 0, 0, 0, -1, 0, 1, 0];
	public static readonly ROTATE_180X: MatrixRotate = [1, 0, 0, 0, -1, 0, 0, 0, -1];
	public static readonly ROTATE_270X: MatrixRotate = [1, 0, 0, 0, 0, 1, 0, -1, 0];

	public static readonly ROTATE_90Z: MatrixRotate = [0, -1, 0, 1, 0, 0, 0, 0, 1];
	public static readonly ROTATE_180Z: MatrixRotate = [-1, 0, 0, 0, -1, 0, 0, 0, 1];
	public static readonly ROTATE_270Z: MatrixRotate = [0, 1, 0, -1, 0, 0, 0, 0, 1];

	public static readonly MIRROR_X: MatrixRotate = [-1, 0, 0, 0, 1, 0, 0, 0, 1];
	public static readonly MIRROR_Y: MatrixRotate = [1, 0, 0, 0, -1, 0, 0, 0, 1];
	public static readonly MIRROR_Z: MatrixRotate = [1, 0, 0, 0, 1, 0, 0, 0, -1];

	public static readonly ROTATE_Y: MatrixRotate[] = [Rotate.ROTATE_NONE, Rotate.ROTATE_90Y, Rotate.ROTATE_180Y, Rotate.ROTATE_270Y];
	public static readonly ROTATE_ALL: MatrixRotate[] = [Rotate.ROTATE_180X, Rotate.ROTATE_180Y, Rotate.ROTATE_180Z, Rotate.ROTATE_270X, Rotate.ROTATE_270Y, Rotate.ROTATE_270Z, Rotate.ROTATE_90X, Rotate.ROTATE_90Y, Rotate.ROTATE_90Z, Rotate.ROTATE_NONE];

	public static readonly ROTATE_RANDOM: MatrixRotate[] = Rotate.ROTATE_ALL;
}

EXPORT("Rotate", Rotate);