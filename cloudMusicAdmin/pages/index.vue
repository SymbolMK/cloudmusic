<style lang='sass' scoped>
    .wrapper
        width: 100%
        height: 100%
        background: white
        text-align: center
        display: flex
        align-items: center
        justify-content: center
        .text
            display: inline-block
            font-size: 14px
            color: #606266
</style>
<style>
    .ityped-cursor {
        font-size: 14px;
        color: #606266;
        opacity: 1;
        -webkit-animation: blink 0.3s infinite;
        -moz-animation: blink 0.3s infinite;
        animation: blink 0.3s infinite;
        animation-direction: alternate;
    }

    @keyframes blink {
        100% {
            opacity: 0;
        }
    }

    @-webkit-keyframes blink {
        100% {
            opacity: 0;
        }
    }

    @-moz-keyframes blink {
        100% {
            opacity: 0;
        }
    }
</style>
<template lang='pug'>
    div.wrapper 
        .text(ref='text')
</template>

<script>
    export default {
        data() {
            return {
                textList: [
                    ['Valar Morghulis！Valar Dohaeris！', '凡人皆有一死！凡人皆须服从！'],
                    ['Most man rather deny the turth than face it.', '大部分的人宁可否认事实，也不愿面对真相。'],
                    ['A mind needs books like as word needs a whetstone.' ,'思想需要书来磨砺，正如宝剑需要磨刀石'],
                    ["Chaos isn't a pit,Chaos is a ladder",'混乱不是深渊,混乱是阶梯.']
                ]
            }
        },
        beforeCreate() {},
        created() {},
        beforeMount() {},
        mounted() {
            this.initText()
        },
        methods: {
            initText() {
                let k = Math.floor(Math.random() * (this.textList.length) + 1)
                ityped.init(this.$refs.text, { 
                    strings: this.textList[k],
                        
                    /**
                     * @param {Number} typeSpeed Type speed in milliseconds
                     */
                    typeSpeed:  100,
                
                    /**
                     * @param {Number} backSpeed Type back speed in milliseconds
                     */
                    backSpeed:  50,
                    
                    /**
                     * @param {Number} startDelay Time before typing starts
                     */
                    startDelay: 500,
                    
                    /**
                     * @param {Number} backDelay Time before backspacing
                     */
                    backDelay:  500,
                    
                    /**
                     * @param {Bollean} loop The animation loop
                     */
                    loop:       false,
                    
                    /**
                     * @param {Bollean} showCursor Show the cursor element
                     */
                    showCursor: true,
                    
                    /**
                     * @param {Bollean} placeholder Write the string in the placeholder content
                     */
                    placeholder: false,
                    
                    /**
                     * @param {Bollean} disableBackTyping Disable back typing for the last string sentence 
                     */
                    disableBackTyping: false,
                    
                    /**
                     * @property {String} cursorChar character for cursor
                     */
                    cursorChar: "|",
                    
                    
                    // optional: The callback called (if `loop` is false) 
                    // once the last string was typed
                    /**
                     * @property {Function} onFinished The callback called , if `loop` is false,
                     * once the last string was typed
                     */
                    onFinished: function(){},
                });
            }
        }
    }
</script>