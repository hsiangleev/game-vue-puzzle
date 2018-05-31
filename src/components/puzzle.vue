<template>
    <div class="lee-puzzle" ref="puzzle">
        <div class="lee-begin" v-if="isBegin">
            <div class="lee-diff">
                <span @click="diff('x')">{{ initData.x }}</span>
                <span>*</span>
                <span @click="diff('y')">{{ initData.y }}</span>
            </div>
            <div class="lee-point" @click="selectPoint">
                <span>第</span>
                {{ Checkpoint+1 }}
                <span>关</span>
            </div>
            <button @click="begin">开始</button>
        </div>
        <canvas ref="cvs" width="800" height="600"></canvas>
        <div class="lee-replace" ref="replace" @mousedown="mouseDown" @touchstart="touchDown" @mouseup="mouseUp" @touchend="touchUp">
            <div class="lee-replace-old" ref="old" v-show="isShowOld"></div>
            <div class="lee-replace-new" ref="new" v-show="isShowNew"></div>
        </div>
        <div class="lee-over" v-if="isFinish" :style="{lineHeight: height+'px'}">
            good!
        </div>
    </div>
</template>

<script>
    export default {
        name: "puzzle",
        props: ["initData"],
        data() {
            return {
                ctx: "",
                puzzle: "",
                oldEle: "",
                newEle: "",
                replace: "",
                width: 0,               // 整个画布大小
                height: 0,
                partWidth: 0,           // 画布上的小图片大小
                partHeight: 0,          
                originPartWidth: 0,     // 原始图片每块的大小
                originPartHeight: 0,
                l: 0,           // 大盒子在文档中的位置
                t: 0,
                x: 0,           // 鼠标在小盒子中的坐标
                y: 0,
                centerX: 0,     // 中心点坐标
                centerY: 0,
                oldX: 0,        // 旧图片位置
                oldY: 0,
                newX: 0,        // 新图片位置
                newY: 0,
                repX: 0,        // 旧图片在原图片上面的位置
                repY: 0,
                repXX: 0,
                repYY: 0,
                i: 0,           // down时的小盒子位置（0，1，2）
                j: 0,           // up时的小盒子位置（0，1，2）
                orginArr: [],
                randomArr: [],
                isShowOld: false,
                isShowNew: false,
                isFinish: false,
                isBegin: true,
                isMove: false,      // 判断鼠标是否移动
                Checkpoint: 0,      // 当前关卡
                img: "",
            }
        },
        computed: {
            isTouch() {
                return document.body.clientWidth<992;       // 小屏幕touch，大屏幕mouse
            },
            pointNum() {
                return this.initData.imgUrl.length;         // 关卡总数
            }
        },
        mounted() {
            
        },
        methods: {
            loadImg(src) {
                var promise=new Promise((resolve,reject)=>{
                    var img=new Image();
                    img.onload=resolve.bind(null,img);
                    img.onerror=reject;
                    img.src=src;
                })
                return promise;
            },
            _initCanvas() {
                this.puzzle=this.$refs["puzzle"];
                let cvs=this.$refs["cvs"];
                this.ctx=cvs.getContext("2d");
                this.width=this.puzzle.offsetWidth;
                this.height=this.puzzle.offsetHeight;
                this.partWidth=this.width/this.initData.x;
                this.partHeight=this.height/this.initData.y;
                cvs.width=this.width;
                cvs.height=this.height;

                this.replace=this.$refs["replace"];
                this.oldEle=this.$refs["old"];
                this.newEle=this.$refs["new"];
                this.oldEle.style.width=this.newEle.style.width=this.partWidth+"px";
                this.oldEle.style.height=this.newEle.style.height=this.partHeight+"px";
            },
            init() {
                // 初始化坐标
                for(var i=0;i<this.initData.x;i++){
                    for(var j=0;j<this.initData.y;j++){
                        this.orginArr.push([i,j]);
                        this.randomArr.push([i,j]);
                    }
                }
                this.random(this.randomArr);            // 随机数组
            },
            random(arr) {
                arr.sort(()=>{
                    return Math.random()-0.5;
                })
            },
            // 绘制初始随机图片
            drawBackground() {
                this.ctx.clearRect(0,0,this.Width,this.Height);
                this.loadImg(this.initData.imgUrl[this.Checkpoint])
                .then((img)=>{
                    this.img=img;
                    this.originPartWidth=this.img.width/this.initData.x;
                    this.originPartHeight=this.img.height/this.initData.y;
                    this.randomArr.forEach((value,i)=>{
                        this.ctx.drawImage(this.img,
                            value[0]*this.originPartWidth,value[1]*this.originPartHeight,
                            this.originPartWidth,this.originPartHeight,
                            this.orginArr[i][0]*this.partWidth,this.orginArr[i][1]*this.partHeight,
                            this.partWidth,this.partHeight
                        )
                    })
                }).
                catch((arr)=>{
                    throw("图片地址错误");
                })
            },
            down(pageXX,pageYY) {
                this.isMove=false;
                // canvas距离文档的距离
                this.l=this.puzzle.parentNode.offsetLeft;
                this.t=this.puzzle.parentNode.offsetTop;
                // 鼠标在canvas内的坐标
                let left=pageXX-this.l;
                let top=pageYY-this.t;
                // 鼠标按下时所对应的当前小图片的顶部坐标
                this.oldX=Math.floor(left/this.partWidth)*this.partWidth;
                this.oldY=Math.floor(top/this.partHeight)*this.partHeight;
                // 显示old小盒子
                this.isShowOld=true;
                this.oldEle.style.left=this.oldX+"px";
                this.oldEle.style.top=this.oldY+"px";
                this.oldEle.style.outline="1px solid #f69";
                // 鼠标按下时所对应的小盒子位置（[0,0],[0,1],[0,2]...）
                let a=Math.floor(left/this.partWidth);
                let b=Math.floor(top/this.partHeight);
                // 查找鼠标按下时的小盒子是打乱数组的index项
                this.i=0;
                this.orginArr.forEach((val,index)=>{
                    if(val[0]==a && val[1]==b){
                        this.i=index;
                    }
                })
                // 鼠标按下时所对应的当前小图片的顶部坐标（在未打乱图片中的位置）
                this.repX=this.randomArr[this.i][0]*this.partWidth;
                this.repY=this.randomArr[this.i][1]*this.partHeight;
                // 当前点击的图片换成背景图位置
                this.oldEle.style.background="url(" + this.initData.imgUrl[this.Checkpoint] + ") no-repeat top " + -1 * this.repY + "px left " + -1 * this.repX + "px";
                this.oldEle.style.backgroundSize=this.width+"px "+this.height+"px";
                
                    
                this.$nextTick(()=>{
                    // 鼠标在小盒子中的位置
                    this.x=left-this.oldEle.offsetLeft;
                    this.y=top-this.oldEle.offsetTop;
                    if(this.isTouch){
                        this.replace.addEventListener("touchmove",this.move,false)
                    }else{
                        this.replace.addEventListener("mousemove",this.move,false)
                    }
                    
                })
            },
            mouseDown() {
                if(this.isTouch) return;
                this.down(event.pageX,event.pageY);
            },
            move() {
                this.isMove=true;
                this.$nextTick(()=>{
                    this.ctx.clearRect(this.oldX,this.oldY,this.partWidth,this.partHeight);

                    if(this.isTouch && !!event.touches){
                        var left=event.touches[0].clientX-this.l-this.x;
                        var top=event.touches[0].pageY-this.t-this.y;
                    }else{
                        var left=event.pageX-this.l-this.x;
                        var top=event.pageY-this.t-this.y;
                    }
                    left=left<0?0:left;
                    top=top<0?0:top;
                    left=left>this.width-this.partWidth?this.width-this.partWidth:left;
                    top=top>this.height-this.partHeight?this.height-this.partHeight:top;
                    this.oldEle.style.left=left+"px";
                    this.oldEle.style.top=top+"px";

                    // 移动的盒子的中心点坐标
                    this.centerX=left+this.partWidth/2;
                    this.centerY=top+this.partHeight/2;
                    // 计算中心点在哪一块位置
                    this.newX=Math.floor(this.centerX/this.partWidth)*this.partWidth;
                    this.newY=Math.floor(this.centerY/this.partHeight)*this.partHeight;
                    this.isShowNew=true;
                    this.newEle.style.left=this.newX+"px";
                    this.newEle.style.top=this.newY+"px";
                    this.newEle.style.outline="1px solid #69f";
                    // 鼠标移动过程中所对应的小盒子位置（[0,0],[0,1],[0,2]...）
                    let a=Math.floor(this.newX/this.partWidth);
                    let b=Math.floor(this.newY/this.partHeight);
                    // 查找鼠标移动时的小盒子是打乱数组的index项
                    this.j=0;
                    this.orginArr.forEach((val,index)=>{
                        if(val[0]==a && val[1]==b){
                            this.j=index;
                        }
                    })
                    // 鼠标移动时所对应的当前小图片的顶部坐标（在未打乱图片中的位置）
                    this.repXX=this.randomArr[this.j][0]*this.partWidth;
                    this.repYY=this.randomArr[this.j][1]*this.partHeight;
                    // this.newEle.style.background="url(" + this.initData.imgUrl + ") no-repeat top " + -1 * this.repXX + "px left " + -1 * this.repYY + "px";

                })
            },
            mouseUp() {
                this.isShowOld=false;
                this.isShowNew=false;
                
                this.oldEle.style.outline="0px solid #f69";
                this.newEle.style.outline="0px solid #69f";
                // 判断鼠标是否移动
                if(this.isMove) {
                    this.ctx.clearRect(this.newX,this.newY,this.partWidth,this.partHeight);
                    // 交换坐标位置
                    [this.randomArr[this.i],this.randomArr[this.j]]=[this.randomArr[this.j],this.randomArr[this.i]]
                    // 交换两块位置（重绘）
                    this.ctx.drawImage(this.img,
                        this.randomArr[this.j][0]*this.originPartWidth,this.randomArr[this.j][1]*this.originPartHeight,
                        this.originPartWidth,this.originPartHeight,
                        this.newX,this.newY,
                        this.partWidth,this.partHeight
                    )
                    this.ctx.drawImage(this.img,
                        this.randomArr[this.i][0]*this.originPartWidth,this.randomArr[this.i][1]*this.originPartHeight,
                        this.originPartWidth,this.originPartHeight,
                        this.oldX,this.oldY,
                        this.partWidth,this.partHeight
                    )
                }
                
                if(this.isTouch){
                    this.replace.removeEventListener("touchmove",this.move,false)
                }else{
                    this.replace.removeEventListener("mousemove",this.move,false)
                }
                if(JSON.stringify(this.randomArr)==JSON.stringify(this.orginArr)){
                    if(this.Checkpoint>=this.pointNum-1){
                        this.isFinish=true;
                    }else{
                        this.Checkpoint++;
                        this.orginArr=[];
                        this.randomArr=[];
                        this._initCanvas();
                        this.init();
                        this.drawBackground();
                    }
                }
            },
            touchDown() {
                this.down(event.touches[0].clientX,event.touches[0].clientY);
            },
            touchUp() {
                this.mouseUp();
            },
            begin() {
                this._initCanvas();
                this.init();
                this.drawBackground();
                this.isBegin=false;
            },
            diff(type) {
                let temp=this.initData[type];
                this.initData[type]=temp > 9 ? 2 : temp+1;
            },
            selectPoint() {
                let temp=this.Checkpoint;
                this.Checkpoint=temp >= this.pointNum-1 ? 0 : temp+1;
            },
        }
    }
</script>

<style lang="scss">
    @mixin posi {
        position: absolute;
        top: 0px;
        left: 0px;
    }
    .lee-puzzle{
        width: 100%;
        height: 100%;
        outline: 1px solid #ccc;
        position: absolute;
        canvas{
            @include posi;
        }
        .lee-replace{
            width: 100%;
            height: 100%;
            @include posi;
            .lee-replace-old,
            .lee-replace-new{
                @include posi;
            }
            .lee-replace-old{
                z-index: 1;
            }
        }
    }
    .lee-over,
    .lee-begin{
        width: 100%;
        height: 100%;
        position: absolute;
        background-color: rgba(0,0,0,.5);
        text-align: center;
        color: #fff;
        font-size: 80px;
        user-select: none;
    }
    .lee-begin{
        z-index: 2;
        background-color: rgba(60, 180, 180, 0.8);
        .lee-diff{
            width: 100%;
            position: absolute;
            top: 10%;
        }
        .lee-point{
            width: 100%;
            position: absolute;
            top: 25%;
            &>span{
                font-size: 50px;
                position: relative;
                top: -11px;
            }
        }
        button {
            width: 100px;
            height: 40px;
            background-color: #69f;
            outline: none;
            position: absolute;
            top: 46%;
            left: 50%;
            cursor: pointer;
            margin-left: -50px;
            font: 700 20px/30px "Microsoft Yahei";
            color: #fff;
        }
    }
    
    @media screen and (max-width: 768px) {
        canvas, .lee-over, .lee-begin {
            width: 100%;
            height: 100%;
            margin: 0;
            top: 0;
            left: 0;
        }
    }
</style>
