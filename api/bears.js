class BearFactory {
    constructor() {
        this.eyePool = [0, 1, 2];
        this.furPool = [0, 1, 2];
        this.elementPool = [0, 1, 2];
        this.itemPool = [0, 1, 2];
    }

    getAttrs() {
        return Object.keys(this);
    }

    getRandomIndex(pool) {
        return pool[Math.floor(Math.random() * pool.length)];
    }

    getMutateBear(bear) {
        function formatPool(itemPool) {
            return '__' + itemPool.split('Pool')[0];
        }

        let mutateBear = bear;

        let attrs = this.getAttrs();

        let selectedMutationPool = attrs[Math.floor(Math.random() * attrs.length)];

        const mutateAttrName = formatPool(selectedMutationPool);

        let newValue = this.getRandomIndex(this[selectedMutationPool]);

        while (newValue === bear[mutateAttrName]) {
            //generate new Value
            newValue = this.getRandomIndex(this[selectedMutationPool]);
        }

        mutateBear[mutateAttrName] = newValue;

        return {
            mutateBear,
            mutateAttrName,
        };
    }

    getRandomBear() {
        const randomEye = this.getRandomIndex(this.eyePool);
        const randomFur = this.getRandomIndex(this.furPool);
        const randomElement = this.getRandomIndex(this.elementPool);
        const randomItem = this.getRandomIndex(this.itemPool);

        const name='RandomBear'
        const imageID=[randomEye,randomFur, randomElement,randomItem].join("")
        const image='bear'+`_${imageID}`+`.png`;

        return new Bear(randomEye, randomFur, randomElement, randomItem,name,'Normal',image);
    }
    getPoolBear() {
        const pool = [];
        for (let eye of this.eyePool) {
            for (let fur of this.furPool) {
                for (let element of this.elementPool) {
                    for (let item of this.itemPool) {
                        const bear = new Bear(eye, fur, element, item);
                        pool.push(bear);
                    }
                }
            }
        }
        return pool;
    }
    crossover(mother, father) {
        let son = new Bear();
        let daughter = new Bear();

        function crossOver(attr) {
            son[attr] = father[attr];
            daughter[attr] = mother[attr];

            let random = Math.random();

            if (random < 0.5) {
                // swap
                let temp = son[attr];
                son[attr] = daughter[attr];
                daughter[attr] = temp;
            }
        }

        for (let attr of new Bear().getAttrs()) {
            crossOver(attr);
        }

        return [son, daughter];
    }
    getChild(bears) {

    }
}

class Bear {
    constructor(
        eye = undefined,
        fur = undefined,
        element = undefined,
        item = undefined,
        name = undefined,
        rarity = undefined,
        image = undefined
    ) {
        this.__eye = eye;
        this.__fur = fur;
        this.__element = element;
        this.__item = item;
        this.__name = name;
        this.__rarity = rarity;
        this.__image = image;
    }
    getInfo() {
        return {
            eye: this.__eye,
            fur: this.__fur,
            element: this.__element,
            item: this.__item,
            name: this.__name,
            rarity: this.__rarity,
            image: this.__image,
        };
    }
    getAttrs() {
        // return Object.keys(this);
        return ['__eye', '__fur', '__element', '__item']
    }
}
const factory = new BearFactory()
const bear = factory.getRandomBear()

console.log(bear);

module.exports = { BearFactory, Bear };