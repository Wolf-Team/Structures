/// <reference path="header.ts" />

namespace Utility {
	export function getRandom(random: Random | null): Random {
		if (!(random instanceof Random))
			random = new Random();

		return random;
	}

	export function isInt(x: number): boolean {
		return (x ^ 0) == x;
	}

	export function getSID(ID: number | string) {
		if (typeof ID == "number")
			ID = IDRegistry.getNameByID(ID) || ID.toString();

		return ID;
	}

	export function checkSlot(slot): boolean {
		if (!Utility.isInt(slot.id) && slot.id < 0)
			return false;

		if (slot.data !== undefined)
			if (!Utility.isInt(slot.data) && slot.data < 0)
				return false;

		if (slot.count !== undefined)
			if (!Utility.isInt(slot.count) && slot.count < 1)
				return false;

		return true;
	}
}