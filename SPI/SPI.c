#include "SPI.h"
#include "stdio.h"
#include "stm32f10x.h"

void SPI1_INIT(void)
{
    GPIO_InitTypeDef GPIO_InitDef;
    SPI_InitTypeDef SPI_InitDef;

    // initialize init structs
    GPIO_StructInit(&GPIO_InitDef);
    SPI_StructInit(&SPI_InitDef);

    // initialize clocks
    RCC_APB2PeriphClockCmd(RCC_APB2Periph_SPI1 | RCC_APB2Periph_AFIO | RCC_APB2Periph_GPIOA, ENABLE);

    // initialize A4/SS alternate function open-drain (50 MHz)
    GPIO_InitDef.GPIO_Pin = GPIO_Pin_4 | GPIO_Pin_6;
    GPIO_InitDef.GPIO_Mode = GPIO_Mode_AF_PP;
    //GPIO_InitDef.GPIO_Speed = GPIO_Speed_50MHz;
    GPIO_Init(GPIOA, &GPIO_InitDef);

    // initialize A5/SCK alternate function open-drain (50 MHz)
    GPIO_InitDef.GPIO_Pin = GPIO_Pin_5 | GPIO_Pin_7;
    GPIO_InitDef.GPIO_Mode = GPIO_Mode_IN_FLOATING;
    //GPIO_InitDef.GPIO_Speed = GPIO_Speed_50MHz;
    GPIO_Init(GPIOA, &GPIO_InitDef);

    //  initialize SPI slave
    // for slave, no need to define SPI_BaudRatePrescaler
    SPI_InitDef.SPI_Direction = SPI_Direction_2Lines_FullDuplex;
    SPI_InitDef.SPI_Mode = SPI_Mode_Slave;
    SPI_InitDef.SPI_DataSize = SPI_DataSize_8b; // 8-bit transactions
    SPI_InitDef.SPI_FirstBit = SPI_FirstBit_MSB; // MSB first
    SPI_InitDef.SPI_CPOL = SPI_CPOL_Low; // CPOL = 0, clock idle low
    SPI_InitDef.SPI_CPHA = SPI_CPHA_1Edge; // CPHA = 1
    SPI_InitDef.SPI_NSS = SPI_NSS_Soft; // use hardware SS
    SPI_InitDef.SPI_BaudRatePrescaler = SPI_BaudRatePrescaler_64; // APB2 72/64 = 1.125 MHz
    SPI_InitDef.SPI_CRCPolynomial = 7;
    SPI_Init(SPI1, &SPI_InitDef);

    SPI_I2S_ITConfig(SPI1, SPI_I2S_IT_RXNE, ENABLE);

    SPI_Cmd(SPI1, ENABLE);
    
    NVIC_InitTypeDef NVIC_InitStructure;
    /* 1 bit for pre-emption priority, 3 bits for subpriority */
    NVIC_PriorityGroupConfig(NVIC_PriorityGroup_1);
    NVIC_InitStructure.NVIC_IRQChannel = SPI1_IRQn;
    NVIC_InitStructure.NVIC_IRQChannelPreemptionPriority = 0;
    NVIC_InitStructure.NVIC_IRQChannelSubPriority = 1;
    NVIC_Init(&NVIC_InitStructure);
    
    printf("SPI bus init success...\r\n");
}


u8 SPI_RW(u8 dat)
{
//    while (SPI_I2S_GetFlagStatus(SPI1, SPI_I2S_FLAG_TXE) == RESET);
//    SPI_I2S_SendData(SPI1, dat);

    //while (SPI_I2S_GetFlagStatus(SPI1, SPI_I2S_FLAG_RXNE) == RESET);
    return SPI_I2S_ReceiveData(SPI1);
}
