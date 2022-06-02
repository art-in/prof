cmake_minimum_required(VERSION 3.0)

project(prof-cpp)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++20 -O2 -Wall -Werror")

set(MAIN_SOURCE_DIR "src")
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/build)

include_directories(${CMAKE_CURRENT_SOURCE_DIR}/libs)

file(GLOB_RECURSE CPP_HEADERS ${MAIN_SOURCE_DIR}/*.hpp)
file(GLOB_RECURSE CPP_SOURCES ${MAIN_SOURCE_DIR}/*.cpp)

add_executable(
    prof
    ${CPP_HEADERS}
    ${CPP_SOURCES}
)
