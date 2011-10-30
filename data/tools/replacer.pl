#!/usr/bin/perl

open FIN, "<".$ARGV[0];

my %causeMap;

while(<FIN>)
{
    chomp;
    split /;/;
    $causeMap{$_[0]} = $_[1];
}

$line = <STDIN>;
print $line;

while(<STDIN>)
{
    chomp;
    split /,/;
    $shortCause = substr($_[1], 0, 3);
    if (exists $causeMap{$shortCause} && defined $causeMap{$shortCause})
    {
        print $_[0].",\"".$causeMap{$shortCause}."\",".$_[2].",".$_[3].",".$_[4]."\n";
    }
}

