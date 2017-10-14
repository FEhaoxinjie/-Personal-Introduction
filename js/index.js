let personlDescription = (function () {
    let person = document.getElementById('person'),
        imgList = person.getElementsByTagName('img'),
        imgBox = imgList[0],
        audio = document.getElementsByTagName('audio'),
        scene = document.getElementById('scene'),
        level_2 = scene.getElementsByClassName('level_2')[0],
        level_3 = scene.getElementsByClassName('level_3')[0],
        level_3_ground = level_3.getElementsByClassName('level_3_ground')[0],
        fireWorks = document.getElementById('fireWorks'),
        endingText = document.getElementsByClassName('endingText')[0],
        endingTextSpan = endingText.getElementsByTagName('span'),
        a = .5, v = 0,
        into_Level2 = false,
        leave_Level2 = true,
        abilityBox = document.getElementsByClassName('ability')[0],
        waterList = abilityBox.getElementsByClassName('water'),
        RootFs = parseFloat(document.documentElement.style.fontSize),
        loadingTimer = null,
        randomNum = null,
        readyBtn = document.getElementById('readyBtn');

    let gameBox = document.getElementById('gameBox');

    function loading() {
        let imgList = [
                'Images/bg/bg2.png',
                'Images/bg/cloud.png',
                'Images/bg/coding.gif',
                'Images/bg/eating.gif',
                'Images/bg/ground01.png',
                'Images/bg/ground03.png',
                'Images/bg/ground05.png',
                'Images/bg/loading.gif',
                'Images/bg/loadingbg.gif',
                'Images/bg/sleeping.png',
                'Images/bg/sun.png',
                'Images/obstacle/left.png',
                'Images/obstacle/Mushroom_1.png',
                'Images/obstacle/Mushroom_2.png',
                'Images/obstacle/right.png',
                'Images/obstacle/Sign_2.png',
                'Images/obstacle/stop.png',
                'Images/obstacle/Tree_2.png',
                'Images/person/Boy_Crouch.gif',
                'Images/person/Boy_Down.gif',
                'Images/person/Boy_Idle.gif',
                'Images/person/Boy_Jump.gif',
                'Images/person/Boy_Run.gif'
            ],
            n = 0,
            m = imgList.length;

        imgList.forEach(function (item,index) {
            let img=new Image;
            img.src=item;
            img.onload=function () {
              n++;
                console.log(n);
                if (n>=m){
                  document.getElementById('loadingBg').style.opacity = 0;
                      document.getElementsByClassName('particleBg')[0].style.opacity = 1;
                      readyBtn.style.animationPlayState = 'running';
                  readyBtn.addEventListener('click', function () {
                      document.getElementById('loadingBg').style.display = 'none';
                      document.getElementsByClassName('particleBg')[0].style.display = 'none';
                      startPage();
                  }, false);
              }
            }
        })

    }

    function startPage() {
        audio[0].play();
        audio[0].volume = 0.5;
        audio[1].volume = 0.3;
        audio[2].volume = 0.1;

        gameBox.style.display = 'block';
        gameBox.style.opacity = '1';
        RENDERER.init();
        person.timer1 = window.setInterval(function () {
            if ((parseFloat(person.style.bottom) <= 16)) {
                window.clearInterval(person.timer1);
                person.style.bottom = 16 + '%';
                v = 0;
                person.timer2 = window.setTimeout(function () {
                    imgBox.src = 'Images/person/Boy_Idle.gif';
                    window.clearTimeout(person.timer2);
                    bindKey();
                    controls();
                }, 1000)
                return;
            }
            v += a;
            let topVal = parseFloat(person.style.bottom)
            person.style.bottom = topVal - v + '%';

        }, 17)
    }

    function bindKey() {
        window.onkeydown = function (e) {
            if (e.keyCode === 37) {
                level1Info();
                person.style.transform = 'rotateY(180deg)';
                audio[1].play();
                if (parseFloat(scene.style.left) * RootFs / scene.offsetWidth >= 0.6) {

                    return;
                }
                personRun();
            } else if (e.keyCode === 39) {
                level1Info();
                person.style.transform = 'rotateY(0deg)';
                audio[1].play();
                if (Math.abs(parseFloat(scene.style.left) * RootFs) / scene.offsetWidth >= 0.6) {
                    return;
                }
                personRun();
                scene.style.left = parseFloat(scene.style.left) - .2 + 'rem';


            }
            window.onkeyup = function (e) {
                audio[1].pause();
                imgBox.src = 'Images/person/Boy_Idle.gif';
                person.dataset.run = false;
            }
        };

    }

    function personRun() {
        let person_run = person.dataset.run;
        if (parseFloat(scene.style.left) < 0) {
            scene.style.left = parseFloat(scene.style.left) + .1 + 'rem';
            intoLevel2();
            level2Info();
        }
        if (person_run === 'true') return;
        imgBox.src = 'Images/person/Boy_Run.gif';
        person.dataset.run = true;
    }

    function level1Info() {
        let aboutMe_top = document.getElementById('aboutMe_top'),
            aboutMe_topSpan = aboutMe_top.getElementsByTagName('span'),
            meInfo = document.getElementById('meInfo'),
            meInfoLi = meInfo.getElementsByTagName('li'),
            meInfoSpan = meInfo.getElementsByTagName('span');

        if (Math.abs(parseFloat(scene.style.left)) <= 1) {
            return;
        }
        if (Math.abs(parseFloat(scene.style.left)) >= 3 && Math.abs(parseFloat(scene.style.left)) <= 8) {
            aboutMe_top.style.opacity = '1';
            aboutMe_top.style.transitionDelay = '0s';
            // for (let i = 0; i < aboutMe_topSpan.length; i++) {
            //     let itemSpan = aboutMe_topSpan[i];
            //     itemSpan.style.opacity = '1';
            // }
            for (let i = 0; i < meInfoLi.length; i++) {
                let itemLi = meInfoLi[i];
                if (itemLi.style.transform === 'rotateX(0deg)') continue;
                itemLi.style.transform = 'rotateX(0deg)';
                itemLi.style.transitionDelay = '0s';
            }
            for (let i = 2; i < meInfoSpan.length; i += 2) {
                let itemSpan = meInfoSpan[i];
                if (itemSpan.style.left === '20%') continue;
                itemSpan.style.left = '20%';
                itemSpan.style.transitionDuration = 0.5 + i * 0.05 + 's';
                itemSpan.style.transitionDelay = '.1s';
            }
        } else {
            aboutMe_top.style.opacity = '0';
            aboutMe_top.style.transitionDelay = '1s';
            for (let i = 0; i < meInfoLi.length; i++) {
                let itemLi = meInfoLi[i];
                if (itemLi.style.transform === 'rotateX(-90deg)') continue;
                itemLi.style.transform = 'rotateX(-90deg)';
                itemLi.style.transitionDelay = '.1s';
            }
            for (let i = 2; i < meInfoSpan.length; i += 2) {
                let itemSpan = meInfoSpan[i];
                if (itemSpan.style.left === '100%') continue;
                itemSpan.style.left = '100%';
                itemSpan.style.transitionDuration = 1.1 - i * 0.05 + 's';
                itemSpan.style.transitionDelay = '0';
            }
        }


    }

    function intoLevel2() {
        let personW = (person.offsetWidth),
            sceneLeft = Math.abs(scene.offsetLeft),
            level_2Left = level_2.offsetLeft,
            level_2Width = level_2.offsetWidth;
        if ((sceneLeft + personW + 30 >= level_2Left) && (sceneLeft + personW - 50 < level_2Left + level_2Width)) {
            if (into_Level2 === true && (leave_Level2 === false)) {
                fireWorks.style.top = '100%';
                endingTextSpan[0].style.animationPlayState = 'paused';
                endingTextSpan[1].style.animationPlayState = 'paused';
                person.style.filter = 'grayscale(0%)';
                level_3_ground.style.filter = 'grayscale(0%)';
                abilityBox.style.opacity = 0;
                audio[2].pause();
                return;
            }
            imgList[0].style.display = 'none';
            imgList[1].style.display = 'block';
            imgList[2].style.display = 'none';
            personJump();
            into_Level2 = true;
            leave_Level2 = false;

        } else if (sceneLeft + personW - 30 < level_2Left || (sceneLeft + personW >= level_2Left + level_2Width)) {
            if (into_Level2 === false && leave_Level2 === true) {
                return
            }
            imgList[0].style.display = 'none';
            imgList[1].style.display = 'none';
            imgList[2].style.display = 'block';
            personDown();
            if (sceneLeft + personW >= level_2Left + level_2Width) {
                abilityWater();
            }
            abilityBox.style.opacity = 1;
            into_Level2 = false;
            leave_Level2 = true;
        }

    }

    function personJump() {
        person.jumpDelayTimer = window.setTimeout(function () {
            person.jumpTimer = window.setInterval(function () {
                person.style.bottom = parseFloat(person.style.bottom) + 1 + '%';
                if (parseFloat(person.style.bottom) >= 32) {
                    imgList[0].style.display = 'block';
                    imgList[1].style.display = 'none';
                    imgList[2].style.display = 'none';
                    window.clearTimeout(person.jumpDelayTimer);
                    window.clearInterval(person.jumpTimer);
                }
            }, 17)
        }, 100)
    }

    function personDown() {
        person.downDelayTimer = window.setTimeout(function () {
            person.downTimer = window.setInterval(function () {
                person.style.bottom = parseFloat(person.style.bottom) - 1 + '%';
                if (parseFloat(person.style.bottom) <= 16) {
                    imgList[0].style.display = 'block';
                    imgList[1].style.display = 'none';
                    imgList[2].style.display = 'none';
                    window.clearTimeout(person.downDelayTimer);
                    window.clearInterval(person.downTimer);
                }
            }, 17);
        }, 0)
    }

    function level2Info() {
        let eating = document.getElementsByClassName('eating')[0],
            eatingBox = eating.getElementsByClassName('eatingBox')[0],
            eatingDiv = eating.getElementsByTagName('div'),
            sleeping = document.getElementsByClassName('sleeping')[0],
            sleepingBox = sleeping.getElementsByClassName('sleepingBox')[0],
            sleepingDiv = sleeping.getElementsByTagName('div'),
            coding = document.getElementsByClassName('coding')[0],
            codingBox = coding.getElementsByClassName('codingBox')[0],
            codingDiv = coding.getElementsByTagName('div'),
            sun = document.getElementsByClassName('sun')[0],
            hobby = level_2.getElementsByClassName('hobby')[0],
            occlusion = hobby.getElementsByClassName('occlusion')[0];

        if ((Math.abs(scene.offsetLeft) + 2 * RootFs >= level_2.offsetLeft + eating.offsetLeft) && (Math.abs(scene.offsetLeft) + 2 * RootFs < level_2.offsetLeft + sleeping.offsetLeft)) {
            eatingDiv[1].style.transform = 'translate(-100%,0%)';
            eatingDiv[2].style.transform = 'translate(200%,0%) rotateY(-180deg)';
            eatingBox.style.transform = 'scale(1)';
            occlusion.style.transform = 'scale(0)';
        } else if ((Math.abs(scene.offsetLeft) + 2 * RootFs >= level_2.offsetLeft + sleeping.offsetLeft) && (Math.abs(scene.offsetLeft) + 2 * RootFs < level_2.offsetLeft + coding.offsetLeft)) {
            sleepingDiv[1].style.transform = 'translate(-100%,0%)';
            sleepingDiv[2].style.transform = 'translate(200%,0%) rotateY(-180deg)';
            sleepingBox.style.transform = 'scale(1)';
        } else if ((Math.abs(scene.offsetLeft) + 2 * RootFs >= level_2.offsetLeft + coding.offsetLeft) && (Math.abs(scene.offsetLeft) + 2 * RootFs < level_2.offsetLeft + coding.offsetLeft + codingBox.offsetWidth)) {
            codingDiv[1].style.transform = 'translate(-100%,0%)';
            codingDiv[2].style.transform = 'translate(200%,0%) rotateY(-180deg)';
            codingBox.style.transform = 'scale(1)';
            sun.classList.add('sunMove');

        } else {
            occlusion.style.transform = 'scale(1)';
            eatingDiv[1].style.transform = 'translate(0%,0%)';
            eatingDiv[2].style.transform = 'translate(100%,0%) rotateY(-180deg)';
            eatingBox.style.transform = 'scale(0)';
            sleepingDiv[1].style.transform = 'translate(0%,0%)';
            sleepingDiv[2].style.transform = 'translate(100%,0%) rotateY(-180deg)';
            sleepingBox.style.transform = 'scale(0)';
            codingDiv[1].style.transform = 'translate(0%,0%)';
            codingDiv[2].style.transform = 'translate(100%,0%) rotateY(-180deg)';
            codingBox.style.transform = 'scale(0)';
            sun.classList.remove('sunMove');
        }

    }

    function abilityWater() {
        abilityBox.opacityTimer = window.setInterval(function () {
            abilityBox.style.opacity = parseFloat(abilityBox.style.opacity) + 0.01;
            if (abilityBox.style.opacity >= 1) {
                abilityBox.style.opacity = 1;
                window.clearInterval(abilityBox.opacityTimer);
                waterList[0].waterTimer = window.setInterval(function () {
                    let abilityH = parseFloat(waterList[0].style.height);
                    waterList[0].style.height = abilityH + 1 + '%';
                    if (parseFloat(waterList[0].style.height) >= 100) {
                        waterList[0].style.height = '100%';
                        addPopo(waterList[0], true);
                        window.clearInterval(waterList[0].waterTimer);
                        waterList[1].waterTimer = window.setInterval(function () {
                            let passW = parseFloat(waterList[1].style.width);
                            waterList[1].style.width = passW + 1 + '%';
                            if (parseFloat(waterList[1].style.width) >= 30 && parseFloat(waterList[1].style.width) < 60) {
                                if (waterList[2].waterTimer) {
                                    return;
                                }
                                waterList[2].waterTimer = window.setInterval(function () {
                                    let abilityH = parseFloat(waterList[2].style.height);
                                    waterList[2].style.height = abilityH + 1 + '%';
                                    if (parseFloat(waterList[2].style.height) >= 70) {
                                        waterList[2].style.height = '80%';
                                        addPopo(waterList[2], true);
                                        window.clearInterval(waterList[2].waterTimer);
                                    }
                                }, 17);
                            } else if (parseFloat(waterList[1].style.width) >= 60 && parseFloat(waterList[1].style.width) < 90) {
                                if (waterList[3].waterTimer) {
                                    return;
                                }
                                waterList[3].waterTimer = window.setInterval(function () {
                                    let abilityH = parseFloat(waterList[3].style.height);
                                    waterList[3].style.height = abilityH + 1 + '%';
                                    if (parseFloat(waterList[3].style.height) >= 60) {
                                        waterList[3].style.height = '70%'
                                        addPopo(waterList[3], true);
                                        window.clearInterval(waterList[3].waterTimer);

                                    }
                                }, 17);
                            } else if (parseFloat(waterList[1].style.width) >= 100) {
                                waterList[1].style.width = '100%';
                                addPopo(waterList[1], false);
                                window.clearInterval(waterList[1].waterTimer);
                                waterList[4].waterTimer = window.setInterval(function () {
                                    let abilityH = parseFloat(waterList[4].style.height);
                                    waterList[4].style.height = abilityH + 1 + '%';
                                    if (parseFloat(waterList[4].style.height) >= 98) {
                                        waterList[4].style.height = '98%';
                                        addPopo(waterList[4], true);
                                        window.clearInterval(waterList[4].waterTimer);

                                        fireWorks.fireworkTimer = window.setTimeout(function () {
                                            fireWorks.style.top = '0%';
                                            endingTextSpan[0].style.animationPlayState = 'running';
                                            endingTextSpan[1].style.animationPlayState = 'running';
                                            person.style.filter = 'grayscale(70%)';
                                            level_3_ground.style.filter = 'grayscale(70%)';
                                            audio[2].play();
                                        }, 5000)

                                    }
                                }, 10);
                            }
                        }, 17)
                    }
                }, 17)
            }
        }, 20)
    }

    function addPopo(waterBox, move) {

        let waterBoxW = waterBox.offsetWidth / parseFloat(document.documentElement.style.fontSize),
            waterBoxH = waterBox.offsetHeight / parseFloat(document.documentElement.style.fontSize);

        for (let i = 0; i < Math.round(Math.random() * 30 + 10); i++) {
            let Popo = document.createElement('i'),
                size = Math.random() * 0.2 + 0.1;
            Popo.style.borderRadius = '50%';
            Popo.style.width = size + 'rem';

            Popo.style.height = size + 'rem';
            Popo.style.position = 'absolute';
            Popo.style.left = Math.random() * (waterBoxW - size) + 'rem';
            Popo.style.top = Math.random() * (100 - size / waterBoxH) + '%';
            Popo.style.border = '.01rem solid rgba(255,255,255,' + (Math.random() * 0.8 + 0.1) + ')';
            waterBox.appendChild(Popo);
        }
        if (!move) {
            return
        }
        popoMove(waterBox);
    }

    function popoMove(waterBox) {
        let PopoList = waterBox.getElementsByTagName('i'),
            ranAry = [];
        for (let i = 0; i < Math.round(Math.random() * (PopoList.length - 6) + 5); i++) {
            ranAry.push(Math.round(Math.random() * (PopoList.length - 1)));
        }
        for (let i = 0; i < ranAry.length; i++) {
            let ranNum = ranAry[i];
            PopoList[ranNum].style.transition = 'all ' + (Math.random() * 5 + 1) + 's' + ' ' + (Math.random() * 10 + 1) + 's'

            PopoList[ranNum].moveTimer = window.setTimeout(function () {
                let ranT = (Math.random() * (parseFloat(PopoList[ranNum].style.top)));
                PopoList[ranNum].style.top = ranT + '%';
                window.clearTimeout(PopoList[ranNum].moveTimer);
            }, (Math.random() * 90 + 10))
        }
    }

    function controls() {
        let $controlsBox = $('.controlsBox'),
            $left = $controlsBox.find('.left'),
            $right = $controlsBox.find('.right'),
            $stop = $controlsBox.find('.stop');
        $left.on('tap', function () {
            window.clearInterval($right[0].moveTimer);
            if ($left[0].moveTimer !== undefined) return;
            $left[0].moveTimer = window.setInterval(function () {
                level1Info();
                person.style.transform = 'rotateY(180deg)';
                audio[1].play();
                if (parseFloat(scene.style.left) * RootFs / scene.offsetWidth >= 0.6) {

                    return;
                }
                personRun();
            }, 50)
        })
        $right.on('tap', function () {
            window.clearInterval($left[0].moveTimer);
            if ($right[0].moveTimer !== undefined) {
                console.log(2);
                return;
            }
            $right[0].moveTimer = window.setInterval(function () {
                level1Info();
                person.style.transform = 'rotateY(0deg)';
                audio[1].play();
                if (Math.abs(parseFloat(scene.style.left) * RootFs) / scene.offsetWidth >= 0.6) {
                    return;
                }
                personRun();
                scene.style.left = parseFloat(scene.style.left) - .2 + 'rem';
            }, 50);
        });

        $stop.on('tap', function () {
            window.clearInterval($left[0].moveTimer);
            window.clearInterval($right[0].moveTimer);
            $left[0].moveTimer = undefined;
            $right[0].moveTimer = undefined;
            audio[1].pause();
            imgBox.src = 'Images/person/Boy_Idle.gif';
            person.dataset.run = false;
        })


    }

    return {
        init: function () {
            loading();
        }
    }
})();

personlDescription.init();




