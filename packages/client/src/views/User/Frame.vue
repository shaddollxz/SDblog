<template>
    <div class="form-user gusto-border gusto-flex-center">
        <div class="box">
            <slot name="box"></slot>
        </div>
    </div>
    <div class="tips">
        <slot name="tips"></slot>
    </div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
.form-user {
    width: 33%;
    min-width: 20rem;
    height: max-content;
    box-sizing: border-box;
    padding: 6rem 0 4rem 0;
    background-color: var(--color-bg-bland);
    .box {
        width: 60%;
        .text {
            position: relative;
            font-family: "xingyan";
            font-weight: bold;
            font-size: var(--fontsize-big);
            margin-bottom: $gap-large;
            a {
                position: absolute;
                right: 0;
                bottom: 0;
                font-size: var(--fontsize-tiny);
                color: var(--color-blue);
            }
        }
        .checkInput {
            margin-bottom: $gap-xlarge;
            &.noPassTip {
                .correct {
                    display: none;
                }
            }
        }
        .checkButton {
            width: 100%;
            height: 4rem;
            font-weight: 600;
            font-size: var(--fontsize-large);
            border-radius: $border-r-big;
            margin-top: $gap-xxlarge;
        }
        .emailBox {
            .email {
                display: flex;
                .checkButton {
                    font-family: "chuyuan";
                    font-size: var(--fontsize-small);
                    width: 7rem;
                    height: 2.3rem;
                    padding: 0.3rem 0.3rem;
                    border-radius: $border-r-big;
                    margin: 0 0 0 1rem;
                    @include mobile {
                        width: 8rem;
                        padding: 0.3rem 0.3rem;
                        margin-left: 0.5rem;
                    }
                }
            }
            .codeBox {
                margin-bottom: 1.3rem;
                input {
                    padding: 0.1rem 0.4rem;
                }
            }
        }
    }
    @include mobile {
        width: 96%;
        .box {
            .text {
                font-size: var(--fontsize-default);
            }
            button {
                font-size: var(--fontsize-big);
            }
        }
    }
}
.tips {
    height: 5rem;
    line-height: 5rem;
    font-size: var(--fontsize-small);
    :last-child {
        color: #0969da;
        cursor: pointer;
    }
}
</style>
