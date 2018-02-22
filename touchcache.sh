#!/bin/sh

find php/cache/data -name "*.json" -exec touch '{}' ';'
