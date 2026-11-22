---
title: 用一个小状态机，整理 C 语言主循环
description: 把等待、采样与处理分成清晰的状态，让下一次调试更容易定位问题。
date: 2026-11-20
category: C 语言实践
tags: [C语言, 状态机]
---

## 先给程序的阶段命名

当主循环里出现许多互相依赖的标志位时，可以先列出系统正在经历的阶段。以一个简化采样流程为例：等待请求、启动采样、等待完成、处理结果。

状态机的价值在于，每一轮循环都能回答两个问题：现在处于什么状态？什么条件会让它进入下一状态？

## 一个最小结构

下面是用于解释结构的伪代码接口。`sample_start`、`sample_ready` 和 `sample_process` 需要按实际硬件实现，代码并非可直接烧录的完整工程。

```c
typedef enum {
    SAMPLE_IDLE,
    SAMPLE_WAIT,
    SAMPLE_PROCESS
} sample_state_t;

static sample_state_t state = SAMPLE_IDLE;

void sample_step(bool requested)
{
    switch (state) {
    case SAMPLE_IDLE:
        if (requested) {
            sample_start();
            state = SAMPLE_WAIT;
        }
        break;
    case SAMPLE_WAIT:
        if (sample_ready()) {
            state = SAMPLE_PROCESS;
        }
        break;
    case SAMPLE_PROCESS:
        sample_process();
        state = SAMPLE_IDLE;
        break;
    default:
        state = SAMPLE_IDLE;
        break;
    }
}
```

这里的 `requested` 应表示一次已经消费的请求事件；如果长期保持为真，回到空闲后会再次启动。`sample_start` 和 `sample_process` 也应足够短，以免阻塞其他任务。

## 给异常留一条路

真实设备不会总按计划返回结果。等待状态应设置超时；错误处理应明确记录失败原因，并决定重试还是回到安全的空闲状态。

如果中断和主循环共享数据，还需要结合平台考虑原子访问、临界区和内存可见性。增加 `volatile` 并不能自动解决所有并发问题。

## 让状态变化可观察

调试时优先记录状态转换，而不是每轮循环都输出完整状态。一次有用的日志可以包含时间、原状态、新状态和触发原因。

记录一条成功路径，再记录一条超时路径。当这两条路径都能复现，状态图才真正成为维护代码的工具。
