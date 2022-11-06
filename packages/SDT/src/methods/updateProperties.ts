import type { PickByType, SeparationArrayProperty } from "../typings/utils";
import removeItem from "./removeItem";
import deepClone from "./deepClone";
import SDMath from "./SDMath";

export interface UpdatePropertiesOptions<ObjectType extends object> {
    $set?: Partial<ObjectType>;
    $push?: Partial<SeparationArrayProperty<PickByType<ObjectType, any[]>>>;
    $pop?: Partial<{ [K in keyof PickByType<ObjectType, any[]>]: number }>;
    $unshift?: Partial<SeparationArrayProperty<PickByType<ObjectType, any[]>>>;
    $shift?: Partial<{ [K in keyof PickByType<ObjectType, any[]>]: number }>;
    $pull?: Partial<SeparationArrayProperty<PickByType<ObjectType, any[]>>>;
    $inc?: Partial<PickByType<ObjectType, number>>;
    $mul?: Partial<PickByType<ObjectType, number>>;
    $anti?: (keyof PickByType<ObjectType, boolean>)[];
    $concat?: Partial<PickByType<ObjectType, string>>;
}

export default function <Original extends object>(
    _original: Original,
    updateOption: UpdatePropertiesOptions<Original>
) {
    const original = deepClone(_original);
    for (let updateMethod in updateOption) {
        const changedTo = updateOption[updateMethod]!;
        if (Array.isArray(changedTo)) {
            for (const key of changedTo) {
                switch (updateMethod as keyof UpdatePropertiesOptions<Original>) {
                    case "$anti": {
                        original[key] = !original[key];
                        break;
                    }
                }
            }
        } else {
            switch (updateMethod as keyof UpdatePropertiesOptions<Original>) {
                case "$set": {
                    for (let key in changedTo) {
                        original[key] = changedTo[key]!;
                    }
                    break;
                }
                case "$push": {
                    for (let key in changedTo) {
                        original[key].push(changedTo[key]);
                    }
                    break;
                }
                case "$pop": {
                    for (let key in changedTo) {
                        for (let i = 0; i < changedTo[key]; i++) {
                            original[key].pop();
                        }
                    }
                    break;
                }
                case "$shift": {
                    for (let key in changedTo) {
                        original[key].shift();
                    }
                    break;
                }
                case "$unshift": {
                    for (let key in changedTo) {
                        original[key].unshift(changedTo[key]);
                    }
                    break;
                }
                case "$pull": {
                    for (let key in changedTo) {
                        removeItem(original[key], key, true);
                    }
                    break;
                }
                case "$inc": {
                    for (let key in changedTo) {
                        original[key] = SDMath.add(original[key], changedTo[key]);
                    }
                    break;
                }
                case "$mul": {
                    for (let key in changedTo) {
                        original[key] = SDMath.mul(original[key], changedTo[key]);
                    }
                    break;
                }
                case "$concat": {
                    for (let key in changedTo) {
                        original[key] += changedTo[key];
                    }
                    break;
                }
            }
        }
    }
    return original;
}
